# Lambda Function Templates - LINCE

## High-Performance Node.js Lambda Template

```javascript
// LINCE Lambda Function: {{FUNCTION_NAME}}
// {{DESCRIPTION}}
// High-performance serverless computing optimized for speed and scalability

const AWS = require('aws-sdk');

// Optimized AWS service initialization (reuse connections)
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    maxRetries: 2,
    httpOptions: {
        timeout: 5000,
        connectTimeout: 1000
    }
});

// Fast structured logging
const logger = {
    info: (msg, meta = {}) => console.log(JSON.stringify({ level: 'INFO', message: msg, ...meta, timestamp: Date.now() })),
    error: (msg, meta = {}) => console.log(JSON.stringify({ level: 'ERROR', message: msg, ...meta, timestamp: Date.now() })),
    warn: (msg, meta = {}) => console.log(JSON.stringify({ level: 'WARN', message: msg, ...meta, timestamp: Date.now() }))
};

// Connection reuse and performance optimization
let cachedResults = new Map();
const CACHE_TTL = 300000; // 5 minutes

/**
 * LINCE High-Performance Lambda Handler
 * Optimized for minimal cold start and maximum throughput
 */
exports.handler = async (event, context) => {
    // Optimize context for performance
    context.callbackWaitsForEmptyEventLoop = false;
    
    const startTime = process.hrtime.bigint();
    const requestId = context.awsRequestId;
    
    try {
        // Fast parameter extraction
        {{PARAMETERS}}
        
        // Quick validation (fail fast)
        validateInputsFast({{PARAMETER_LIST}});
        
        // Check cache for performance optimization
        const cacheKey = generateCacheKey({{PARAMETER_LIST}});
        const cached = getCachedResult(cacheKey);
        if (cached) {
            logger.info('Cache hit', { requestId, cacheKey });
            return formatSuccessResponse(cached, startTime, requestId, true);
        }
        
        // Execute high-performance business logic
        const result = await processRequestOptimized({
            {{PARAMETER_OBJECT}}
        });
        
        // Cache result for future requests
        setCachedResult(cacheKey, result);
        
        return formatSuccessResponse(result, startTime, requestId);
        
    } catch (error) {
        const executionTime = Number(process.hrtime.bigint() - startTime) / 1000000;
        
        logger.error('Lambda execution failed', {
            functionName: '{{FUNCTION_NAME}}',
            error: error.message,
            stack: error.stack,
            requestId,
            executionTime
        });
        
        return {
            statusCode: error.statusCode || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Execution-Time': executionTime.toString()
            },
            body: JSON.stringify({
                success: false,
                error: {
                    message: error.message,
                    type: error.name || 'InternalError',
                    code: error.code || 'INTERNAL_ERROR'
                },
                metadata: {
                    functionName: '{{FUNCTION_NAME}}',
                    businessLine: 'LINCE',
                    timestamp: Date.now(),
                    executionTime,
                    requestId
                }
            })
        };
    }
};

/**
 * High-performance business logic implementation
 * Formula: {{FORMULA}}
 */
async function processRequestOptimized(params) {
    const startProcessing = process.hrtime.bigint();
    
    try {
        // Implement optimized version of: {{FORMULA}}
        {{FORMULA}}
        
        const processingTime = Number(process.hrtime.bigint() - startProcessing) / 1000000;
        logger.info('Processing completed', { 
            processingTime,
            resultSize: JSON.stringify(result).length 
        });
        
        return result;
        
    } catch (error) {
        logger.error('Processing failed', { error: error.message });
        throw error;
    }
}

/**
 * Ultra-fast input validation
 */
function validateInputsFast(...params) {
    {{VALIDATIONS}}
}

/**
 * Performance-optimized caching functions
 */
function generateCacheKey(...params) {
    return Buffer.from(JSON.stringify(params)).toString('base64').slice(0, 32);
}

function getCachedResult(key) {
    const cached = cachedResults.get(key);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }
    if (cached) {
        cachedResults.delete(key); // Clean expired entries
    }
    return null;
}

function setCachedResult(key, data) {
    // Prevent memory bloat - keep only most recent 100 entries
    if (cachedResults.size >= 100) {
        const firstKey = cachedResults.keys().next().value;
        cachedResults.delete(firstKey);
    }
    
    cachedResults.set(key, {
        data,
        timestamp: Date.now()
    });
}

/**
 * Optimized response formatting
 */
function formatSuccessResponse(result, startTime, requestId, fromCache = false) {
    const executionTime = Number(process.hrtime.bigint() - startTime) / 1000000;
    
    logger.info('Lambda execution completed', {
        functionName: '{{FUNCTION_NAME}}',
        executionTime,
        requestId,
        fromCache,
        resultSize: JSON.stringify(result).length
    });
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'X-Execution-Time': executionTime.toString(),
            'X-Cache-Hit': fromCache.toString(),
            'X-Business-Line': 'LINCE'
        },
        body: JSON.stringify({
            success: true,
            data: result,
            metadata: {
                functionName: '{{FUNCTION_NAME}}',
                businessLine: 'LINCE',
                timestamp: Date.now(),
                executionTime,
                fromCache,
                requestId
            }
        })
    };
}
```

## High-Performance Python Lambda Template

```python
# LINCE Lambda Function: {{FUNCTION_NAME}}
# {{DESCRIPTION}}
# High-performance serverless computing with Python optimization

import json
import time
import os
import logging
from typing import Dict, Any, Union, Optional
from functools import lru_cache
import asyncio

# Optimized logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration constants
BUSINESS_LINE = 'LINCE'
FUNCTION_NAME = '{{FUNCTION_NAME}}'
CACHE_SIZE = 128
PERFORMANCE_THRESHOLD_MS = 100

# Global cache for connection reuse
_cached_connections = {}

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    LINCE High-Performance Lambda Handler
    Optimized for minimal latency and maximum throughput
    """
    start_time = time.perf_counter()
    request_id = context.aws_request_id
    
    try:
        # Fast parameter extraction
        {{PARAMETERS}}
        
        # Rapid validation
        validate_inputs_fast(locals())
        
        # Check cache for performance boost
        cache_key = generate_cache_key({{PARAMETER_LIST_PYTHON}})
        cached_result = get_cached_result(cache_key)
        
        if cached_result is not None:
            logger.info(f"Cache hit for key: {cache_key[:8]}...")
            return format_success_response(cached_result, start_time, request_id, True)
        
        # Execute optimized business logic
        result = process_request_optimized({
            {{PARAMETER_OBJECT_PYTHON}}
        })
        
        # Cache for future requests
        set_cached_result(cache_key, result)
        
        return format_success_response(result, start_time, request_id)
        
    except Exception as error:
        execution_time = (time.perf_counter() - start_time) * 1000
        
        logger.error(f"Lambda execution failed", extra={
            'function_name': FUNCTION_NAME,
            'error': str(error),
            'request_id': request_id,
            'execution_time': execution_time
        })
        
        return {
            'statusCode': getattr(error, 'status_code', 500),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Execution-Time': str(execution_time)
            },
            'body': json.dumps({
                'success': False,
                'error': {
                    'message': str(error),
                    'type': type(error).__name__,
                    'code': getattr(error, 'error_code', 'INTERNAL_ERROR')
                },
                'metadata': {
                    'function_name': FUNCTION_NAME,
                    'business_line': BUSINESS_LINE,
                    'timestamp': int(time.time() * 1000),
                    'execution_time': execution_time,
                    'request_id': request_id
                }
            })
        }

def process_request_optimized(params: Dict[str, Any]) -> Any:
    """
    High-performance business logic implementation
    Formula: {{FORMULA}}
    """
    processing_start = time.perf_counter()
    
    try:
        # Optimized implementation of: {{FORMULA}}
        {{FORMULA}}
        
        processing_time = (time.perf_counter() - processing_start) * 1000
        logger.info(f"Processing completed in {processing_time:.2f}ms")
        
        return result
        
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}")
        raise

@lru_cache(maxsize=CACHE_SIZE)
def get_cached_computation(key: str) -> Optional[Any]:
    """LRU cached computation for repeated operations"""
    # Implementation would depend on specific computation
    return None

def validate_inputs_fast(params: Dict[str, Any]) -> None:
    """Ultra-fast input validation"""
    errors = []
    
    # High-speed validations
    {{PARAMETER_VALIDATIONS_PYTHON}}
    
    if errors:
        error = ValueError(f"Validation failed: {'; '.join(errors)}")
        error.status_code = 400
        error.error_code = 'VALIDATION_ERROR'
        raise error

def generate_cache_key(*args) -> str:
    """Generate deterministic cache key"""
    return str(hash(str(args)))[:16]

# Simple in-memory cache with TTL
_cache = {}
_cache_timestamps = {}
CACHE_TTL_SECONDS = 300  # 5 minutes

def get_cached_result(key: str) -> Optional[Any]:
    """Get cached result if not expired"""
    if key in _cache:
        if time.time() - _cache_timestamps[key] < CACHE_TTL_SECONDS:
            return _cache[key]
        else:
            # Clean expired entry
            del _cache[key]
            del _cache_timestamps[key]
    return None

def set_cached_result(key: str, value: Any) -> None:
    """Set cached result with TTL"""
    # Prevent memory bloat
    if len(_cache) >= 100:
        oldest_key = min(_cache_timestamps, key=_cache_timestamps.get)
        del _cache[oldest_key]
        del _cache_timestamps[oldest_key]
    
    _cache[key] = value
    _cache_timestamps[key] = time.time()

def format_success_response(result: Any, start_time: float, request_id: str, from_cache: bool = False) -> Dict[str, Any]:
    """Format optimized success response"""
    execution_time = (time.perf_counter() - start_time) * 1000
    
    logger.info(f"Execution completed", extra={
        'function_name': FUNCTION_NAME,
        'execution_time': execution_time,
        'request_id': request_id,
        'from_cache': from_cache,
        'performance_grade': 'EXCELLENT' if execution_time < PERFORMANCE_THRESHOLD_MS else 'GOOD'
    })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-Execution-Time': str(execution_time),
            'X-Cache-Hit': str(from_cache).lower(),
            'X-Business-Line': BUSINESS_LINE,
            'X-Performance-Grade': 'EXCELLENT' if execution_time < PERFORMANCE_THRESHOLD_MS else 'GOOD'
        },
        'body': json.dumps({
            'success': True,
            'data': result,
            'metadata': {
                'function_name': FUNCTION_NAME,
                'business_line': BUSINESS_LINE,
                'timestamp': int(time.time() * 1000),
                'execution_time': execution_time,
                'from_cache': from_cache,
                'request_id': request_id
            }
        })
    }

# Performance monitoring utilities
def monitor_performance(func):
    """Decorator for performance monitoring"""
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        execution_time = (time.perf_counter() - start) * 1000
        
        if execution_time > PERFORMANCE_THRESHOLD_MS:
            logger.warning(f"Performance threshold exceeded: {func.__name__} took {execution_time:.2f}ms")
        
        return result
    return wrapper
```

## Optimized SAM Template for LINCE

```yaml
# LINCE SAM Template for {{FUNCTION_NAME}}
# High-performance infrastructure with optimal resource allocation

AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  {{FUNCTION_NAME}}
  LINCE high-performance Lambda function with optimized infrastructure

Globals:
  Function:
    Timeout: 15  # Fast timeout for LINCE agility
    Runtime: {{RUNTIME_VERSION}}
    Environment:
      Variables:
        BUSINESS_LINE: LINCE
        LOG_LEVEL: INFO
        PERFORMANCE_MODE: enabled
        
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]
    
  MemorySize:
    Type: Number
    Default: 256  # Optimized for performance
    Description: Lambda memory size (higher for LINCE performance)
    
  ProvisionedConcurrency:
    Type: Number
    Default: 2
    Description: Provisioned concurrency for zero cold starts

Resources:
  {{FUNCTION_NAME}}Function:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: {{HANDLER}}
      Runtime: {{RUNTIME_VERSION}}
      MemorySize: !Ref MemorySize
      ReservedConcurrencyLimit: 20
      ProvisionedConcurrencyConfig:
        ProvisionedConcurrencyUnits: !Ref ProvisionedConcurrency
      Environment:
        Variables:
          ENVIRONMENT: !Ref Environment
          BUSINESS_LINE: LINCE
          CACHE_ENABLED: "true"
          PERFORMANCE_MONITORING: "enabled"
      Events:
        Api:
          Type: Api
          Properties:
            Path: /{{FUNCTION_PATH}}
            Method: post
            RestApiId: !Ref HighPerformanceApi
      Tags:
        BusinessLine: LINCE
        Function: {{FUNCTION_NAME}}
        PerformanceOptimized: true
        
  # High-performance API Gateway
  HighPerformanceApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: !Ref Environment
      CacheClusterEnabled: true
      CacheClusterSize: 0.5
      MethodSettings:
        - ResourcePath: "/*"
          HttpMethod: "*"
          CachingEnabled: true
          CacheTtlInSeconds: 300
          ThrottlingRateLimit: 1000
          ThrottlingBurstLimit: 2000
          
  # CloudWatch Dashboard for performance monitoring
  PerformanceDashboard:
    Type: AWS::CloudWatch::Dashboard
    Properties:
      DashboardName: !Sub "${{{FUNCTION_NAME}}Function}-LINCE-Performance"
      DashboardBody: !Sub |
        {
          "widgets": [
            {
              "type": "metric",
              "properties": {
                "metrics": [
                  ["AWS/Lambda", "Duration", "FunctionName", "${{{FUNCTION_NAME}}Function}"],
                  [".", "Invocations", ".", "."],
                  [".", "Errors", ".", "."],
                  [".", "Throttles", ".", "."]
                ],
                "period": 300,
                "stat": "Average",
                "region": "{{AWS::Region}}",
                "title": "LINCE Performance Metrics"
              }
            }
          ]
        }

  # Performance alarms
  HighLatencyAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub "${{{FUNCTION_NAME}}Function}-HighLatency"
      AlarmDescription: "LINCE function latency is too high"
      MetricName: Duration
      Namespace: AWS/Lambda
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 1000  # 1 second threshold
      ComparisonOperator: GreaterThanThreshold
      Dimensions:
        - Name: FunctionName
          Value: !Ref {{FUNCTION_NAME}}Function

Outputs:
  {{FUNCTION_NAME}}Api:
    Description: "High-performance API Gateway endpoint"
    Value: !Sub "https://${HighPerformanceApi}.execute-api.${AWS::Region}.amazonaws.com/${Environment}/{{FUNCTION_PATH}}/"
    
  {{FUNCTION_NAME}}Function:
    Description: "Lambda Function ARN"
    Value: !GetAtt {{FUNCTION_NAME}}Function.Arn
    
  PerformanceDashboard:
    Description: "CloudWatch Dashboard for performance monitoring"
    Value: !Sub "https://${AWS::Region}.console.aws.amazon.com/cloudwatch/home?region=${AWS::Region}#dashboards:name=${{{FUNCTION_NAME}}Function}-LINCE-Performance"
```
