# Lambda Function Templates - ORGANIC

## Node.js Lambda Template

```javascript
// ORGANIC Lambda Function: {{FUNCTION_NAME}}
// {{DESCRIPTION}}
// Sustainable serverless computing with environmental consciousness

const AWS = require('aws-sdk');

// Initialize AWS services efficiently
const logger = require('./utils/logger');
const validator = require('./utils/validator');

/**
 * ORGANIC Lambda Handler
 * Optimized for sustainability and resource efficiency
 */
exports.handler = async (event, context) => {
    // Context optimization for cold starts
    context.callbackWaitsForEmptyEventLoop = false;
    
    const startTime = Date.now();
    
    try {
        // Log incoming request (structured logging for sustainability)
        logger.info('Lambda execution started', {
            functionName: '{{FUNCTION_NAME}}',
            requestId: context.awsRequestId,
            businessLine: '{{BUSINESS_LINE}}'
        });
        
        // Extract and validate parameters
        {{PARAMETERS}}
        
        // Input validation with clear error messages
        {{VALIDATIONS}}
        
        // Apply business logic/formula
        const result = await processRequest({
            {{PARAMETER_OBJECT}}
        });
        
        // Log success metrics for monitoring
        const executionTime = Date.now() - startTime;
        logger.info('Lambda execution completed successfully', {
            functionName: '{{FUNCTION_NAME}}',
            executionTime,
            requestId: context.awsRequestId
        });
        
        // Return standardized response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'X-Execution-Time': executionTime.toString()
            },
            body: JSON.stringify({
                success: true,
                data: result,
                metadata: {
                    functionName: '{{FUNCTION_NAME}}',
                    businessLine: '{{BUSINESS_LINE}}',
                    timestamp: new Date().toISOString(),
                    executionTime
                }
            })
        };
        
    } catch (error) {
        // Structured error logging
        logger.error('Lambda execution failed', {
            functionName: '{{FUNCTION_NAME}}',
            error: error.message,
            stack: error.stack,
            requestId: context.awsRequestId
        });
        
        // Return error response
        return {
            statusCode: error.statusCode || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: {
                    message: error.message,
                    type: error.name || 'InternalError'
                },
                metadata: {
                    functionName: '{{FUNCTION_NAME}}',
                    businessLine: '{{BUSINESS_LINE}}',
                    timestamp: new Date().toISOString()
                }
            })
        };
    }
};

/**
 * Process the main business logic
 * Implements: {{FORMULA}}
 */
async function processRequest(params) {
    // Apply the specified formula/logic
    {{FORMULA}}
    
    // Return processed result
    return result;
}

/**
 * Utility function for parameter validation
 */
function validateParameters(params) {
    const errors = [];
    
    // Add specific validations based on parameters
    {{PARAMETER_VALIDATIONS}}
    
    if (errors.length > 0) {
        const error = new Error(`Validation failed: ${errors.join(', ')}`);
        error.statusCode = 400;
        error.name = 'ValidationError';
        throw error;
    }
}
```

## Python Lambda Template

```python
# ORGANIC Lambda Function: {{FUNCTION_NAME}}
# {{DESCRIPTION}}
# Sustainable serverless computing with Python

import json
import logging
import datetime
import os
from typing import Dict, Any, Union

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment configuration
BUSINESS_LINE = '{{BUSINESS_LINE}}'
FUNCTION_NAME = '{{FUNCTION_NAME}}'

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    ORGANIC Lambda Handler for sustainable serverless computing
    
    Args:
        event: AWS Lambda event data
        context: AWS Lambda context object
        
    Returns:
        Dict containing the response with standardized structure
    """
    start_time = datetime.datetime.now()
    
    try:
        # Structured logging for monitoring
        logger.info(f"Lambda execution started", extra={
            'function_name': FUNCTION_NAME,
            'request_id': context.aws_request_id,
            'business_line': BUSINESS_LINE
        })
        
        # Extract parameters from event
        {{PARAMETERS}}
        
        # Validate inputs
        validate_parameters(locals())
        
        # Process business logic
        result = process_request({
            {{PARAMETER_OBJECT_PYTHON}}
        })
        
        # Calculate execution time
        execution_time = (datetime.datetime.now() - start_time).total_seconds()
        
        # Log success
        logger.info(f"Lambda execution completed successfully", extra={
            'function_name': FUNCTION_NAME,
            'execution_time': execution_time,
            'request_id': context.aws_request_id
        })
        
        # Return success response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'X-Execution-Time': str(execution_time)
            },
            'body': json.dumps({
                'success': True,
                'data': result,
                'metadata': {
                    'function_name': FUNCTION_NAME,
                    'business_line': BUSINESS_LINE,
                    'timestamp': datetime.datetime.now().isoformat(),
                    'execution_time': execution_time
                }
            })
        }
        
    except Exception as error:
        # Structured error logging
        logger.error(f"Lambda execution failed", extra={
            'function_name': FUNCTION_NAME,
            'error': str(error),
            'request_id': context.aws_request_id
        }, exc_info=True)
        
        # Return error response
        return {
            'statusCode': getattr(error, 'status_code', 500),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': {
                    'message': str(error),
                    'type': type(error).__name__
                },
                'metadata': {
                    'function_name': FUNCTION_NAME,
                    'business_line': BUSINESS_LINE,
                    'timestamp': datetime.datetime.now().isoformat()
                }
            })
        }

def process_request(params: Dict[str, Any]) -> Any:
    """
    Process the main business logic
    Implements: {{FORMULA}}
    
    Args:
        params: Dictionary containing validated parameters
        
    Returns:
        Processed result based on the formula
    """
    try:
        # Apply the specified formula/logic
        {{FORMULA}}
        
        return result
        
    except Exception as e:
        logger.error(f"Error in process_request: {str(e)}")
        raise

def validate_parameters(params: Dict[str, Any]) -> None:
    """
    Validate input parameters
    
    Args:
        params: Dictionary of parameters to validate
        
    Raises:
        ValueError: If validation fails
    """
    errors = []
    
    # Add specific validations based on parameters
    {{PARAMETER_VALIDATIONS_PYTHON}}
    
    if errors:
        error_msg = f"Validation failed: {', '.join(errors)}"
        logger.warning(error_msg)
        error = ValueError(error_msg)
        error.status_code = 400
        raise error

# Utility functions for common operations
def safe_get(dictionary: Dict[str, Any], key: str, default: Any = None) -> Any:
    """Safely get value from dictionary"""
    return dictionary.get(key, default)

def format_response(data: Any, success: bool = True) -> Dict[str, Any]:
    """Format standardized response"""
    return {
        'success': success,
        'data': data,
        'timestamp': datetime.datetime.now().isoformat(),
        'business_line': BUSINESS_LINE
    }
```

## SAM Template for Deployment

```yaml
# ORGANIC SAM Template for {{FUNCTION_NAME}}
# Sustainable infrastructure as code

AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  {{FUNCTION_NAME}}
  ORGANIC Lambda function with sustainable architecture

Globals:
  Function:
    Timeout: 30
    Runtime: {{RUNTIME_VERSION}}
    Environment:
      Variables:
        BUSINESS_LINE: {{BUSINESS_LINE}}
        LOG_LEVEL: INFO
        
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]
    Description: Deployment environment
    
  MemorySize:
    Type: Number
    Default: 128
    Description: Lambda memory size (optimized for sustainability)

Resources:
  {{FUNCTION_NAME}}Function:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: {{HANDLER}}
      Runtime: {{RUNTIME_VERSION}}
      MemorySize: !Ref MemorySize
      Environment:
        Variables:
          ENVIRONMENT: !Ref Environment
          BUSINESS_LINE: {{BUSINESS_LINE}}
      Events:
        Api:
          Type: Api
          Properties:
            Path: /{{FUNCTION_PATH}}
            Method: post
      Tags:
        BusinessLine: {{BUSINESS_LINE}}
        Function: {{FUNCTION_NAME}}
        Sustainability: true
        
  # CloudWatch Log Group with retention
  {{FUNCTION_NAME}}LogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/aws/lambda/${{{FUNCTION_NAME}}Function}'
      RetentionInDays: 30

Outputs:
  {{FUNCTION_NAME}}Api:
    Description: "API Gateway endpoint URL"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/{{FUNCTION_PATH}}/"
  
  {{FUNCTION_NAME}}Function:
    Description: "Lambda Function ARN"
    Value: !GetAtt {{FUNCTION_NAME}}Function.Arn
    
  {{FUNCTION_NAME}}FunctionIamRole:
    Description: "Implicit IAM Role created"
    Value: !GetAtt {{FUNCTION_NAME}}FunctionRole.Arn
```
