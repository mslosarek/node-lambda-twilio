'use strict';

const AWS = require('aws-sdk'),
    dynamo = new AWS.DynamoDB.DocumentClient(),
    crypto = require('crypto'),
    querystring = require('querystring'),
    tableName = process.env.TABLE_NAME;

const createResponse = function(statusCode, body) {
    return {
        statusCode: statusCode,
        body: body
    };
};

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
const uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

exports.handleTwilio = function(event, context, callback) {
    let form;
    try {
        form = querystring.parse(event.form);
    } catch(err) {
        callback(null, createResponse(400, 'Unable to Parse Form'));
    }
    if (form) {
        let itm = Object.keys(form).reduce((itm, key) => {
            if (form[key] !== '') { // eliminate empty string values (DynamoDB does not allow them)
                itm[key] = form[key];
            }
            return itm;
        }, {
            id: uuidv4()
        });

        const params = {
            TableName: tableName,
            Item: itm
        };

        dynamo.put(params).promise()
        .then((data) => {
            // success
            // Twilio Response Message: https://www.twilio.com/docs/api/twiml/sms/your_response
            if (itm.Body) {
                callback(null, createResponse(200, `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You sent the message: ${itm.Body}</Message></Response>`));
            } else {
                callback(null, createResponse(200, `<?xml version="1.0" encoding="UTF-8"?><Response><Message>I'm not sure what message you sent.</Message></Response>`));
            }
            return;
        })
        .catch(function(err) {
            // failure
            console.log(err);
            callback(null, createResponse(500, 'Failure'));
        });
    } else {
        callback(null, createResponse(400, 'Bad Request'));
    }
};