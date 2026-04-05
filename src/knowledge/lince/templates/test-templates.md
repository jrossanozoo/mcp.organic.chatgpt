# Test Templates - LINCE

## High-Performance JavaScript/TypeScript Unit Test Template

```javascript
// LINCE - {{TEST_NAME}} High-Performance Unit Tests
// Optimized for speed, precision, and agility
// Focus: Performance-first testing approach

const { {{FUNCTION_NAME}} } = require('{{TARGET_FILE}}');
const { performance } = require('perf_hooks');

describe('{{TEST_NAME}} - LINCE Performance Tests', () => {
  let performanceMetrics = {};
  
  beforeAll(() => {
    // Initialize performance monitoring
    performanceMetrics.suiteStart = performance.now();
  });

  afterAll(() => {
    // Log performance metrics for optimization
    performanceMetrics.suiteEnd = performance.now();
    const totalTime = performanceMetrics.suiteEnd - performanceMetrics.suiteStart;
    console.log(`Test Suite Performance: ${totalTime.toFixed(2)}ms`);
  });

  beforeEach(() => {
    // Fast test isolation
    performanceMetrics.testStart = performance.now();
  });

  afterEach(() => {
    // Track individual test performance
    const testTime = performance.now() - performanceMetrics.testStart;
    expect(testTime).toBeLessThan(50); // LINCE speed requirement
  });

  // Core functionality tests with performance focus
  test('should execute core functionality with optimal performance', () => {
    // Arrange - Minimal, fast setup
    const inputData = { id: 1, value: 'test' };
    const expected = true;
    
    // Act - Measure execution time
    const startTime = performance.now();
    const result = {{FUNCTION_NAME}}(inputData);
    const executionTime = performance.now() - startTime;
    
    // Assert - Function correctness and performance
    expect(result).toBe(expected);
    expect(executionTime).toBeLessThan(10); // LINCE performance threshold
  });

  test('should handle high-volume data efficiently', () => {
    // LINCE scalability test
    const largeDataset = Array(10000).fill().map((_, i) => ({ id: i, value: `item_${i}` }));
    
    const startTime = performance.now();
    const result = {{FUNCTION_NAME}}(largeDataset);
    const executionTime = performance.now() - startTime;
    
    expect(result).toBeDefined();
    expect(executionTime).toBeLessThan(100); // High-performance requirement
  });

  test('should optimize memory usage for large operations', () => {
    // Memory efficiency test
    const memoryBefore = process.memoryUsage().heapUsed;
    
    const result = {{FUNCTION_NAME}}({ 
      complexData: Array(1000).fill({ nested: { data: 'test' } })
    });
    
    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryDiff = memoryAfter - memoryBefore;
    
    expect(result).toBeDefined();
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024); // < 50MB
  });

  test('should handle concurrent operations efficiently', async () => {
    // Concurrency test for LINCE agility
    const concurrentPromises = Array(100).fill().map((_, i) =>
      Promise.resolve({{FUNCTION_NAME}}({ id: i, concurrent: true }))
    );
    
    const startTime = performance.now();
    const results = await Promise.all(concurrentPromises);
    const executionTime = performance.now() - startTime;
    
    expect(results).toHaveLength(100);
    expect(executionTime).toBeLessThan(200); // Fast concurrent processing
  });

  // Edge cases with performance validation
  test('should handle edge cases without performance degradation', () => {
    const testCases = [
      null,
      undefined,
      {},
      [],
      '',
      0,
      -1,
      { invalid: 'structure' }
    ];
    
    testCases.forEach((testCase, index) => {
      const startTime = performance.now();
      const result = {{FUNCTION_NAME}}(testCase);
      const executionTime = performance.now() - startTime;
      
      expect(result).toBeDefined();
      expect(executionTime).toBeLessThan(5); // Fast edge case handling
    });
  });

  // Error handling with quick recovery
  test('should handle errors with minimal performance impact', () => {
    const startTime = performance.now();
    
    expect(() => {
      {{FUNCTION_NAME}}({ forceError: true });
    }).toThrow();
    
    const executionTime = performance.now() - startTime;
    expect(executionTime).toBeLessThan(5); // Fast error handling
  });
});
```

## High-Performance Python Unit Test Template

```python
# LINCE - {{TEST_NAME}} High-Performance Unit Tests
# Optimized for speed, precision, and rapid development

import unittest
import time
import memory_profiler
import concurrent.futures
from {{TARGET_FILE}} import {{FUNCTION_NAME}}

class Test{{TEST_NAME}}Performance(unittest.TestCase):
    """
    LINCE high-performance test suite:
    - Speed-optimized testing
    - Performance validation
    - Scalability verification
    - Quick feedback loops
    """
    
    def setUp(self):
        """Fast test setup with minimal overhead"""
        self.start_time = time.perf_counter()
        self.test_data = {'id': 1, 'value': 'lince_test'}
        
    def tearDown(self):
        """Performance tracking teardown"""
        execution_time = time.perf_counter() - self.start_time
        # LINCE requirement: Each test should complete quickly
        self.assertLess(execution_time, 0.1, f"Test took {execution_time:.3f}s")
    
    def test_core_functionality_performance(self):
        """Test core functionality with performance validation"""
        # Arrange
        input_data = self.test_data
        
        # Act with performance measurement
        start = time.perf_counter()
        result = {{FUNCTION_NAME}}(input_data)
        execution_time = time.perf_counter() - start
        
        # Assert - Both correctness and performance
        self.assertIsNotNone(result)
        self.assertLess(execution_time, 0.01)  # 10ms max for LINCE
        
    def test_high_volume_processing(self):
        """Test scalability with large datasets"""
        # Generate large dataset
        large_dataset = [{'id': i, 'value': f'item_{i}'} for i in range(10000)]
        
        # Measure processing time
        start = time.perf_counter()
        result = {{FUNCTION_NAME}}(large_dataset)
        execution_time = time.perf_counter() - start
        
        # LINCE performance requirements
        self.assertIsNotNone(result)
        self.assertLess(execution_time, 0.1)  # High-performance threshold
        
    @memory_profiler.profile
    def test_memory_efficiency(self):
        """Test memory usage optimization"""
        # Create memory-intensive operation
        large_data = {'items': [{'data': f'item_{i}' * 100} for i in range(1000)]}
        
        result = {{FUNCTION_NAME}}(large_data)
        
        # Verify result without excessive memory usage
        self.assertIsNotNone(result)
        
    def test_concurrent_execution(self):
        """Test concurrent processing capabilities"""
        def execute_function(data):
            return {{FUNCTION_NAME}}(data)
        
        # Prepare concurrent test data
        test_datasets = [{'id': i, 'concurrent': True} for i in range(100)]
        
        start = time.perf_counter()
        
        # Execute concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(execute_function, test_datasets))
        
        execution_time = time.perf_counter() - start
        
        # Validate results and performance
        self.assertEqual(len(results), 100)
        self.assertLess(execution_time, 0.5)  # Fast concurrent processing
        
    def test_edge_cases_speed(self):
        """Test edge cases with speed optimization"""
        edge_cases = [None, {}, [], '', 0, -1, {'invalid': True}]
        
        for case in edge_cases:
            start = time.perf_counter()
            result = {{FUNCTION_NAME}}(case)
            execution_time = time.perf_counter() - start
            
            # Each edge case should be handled quickly
            self.assertIsNotNone(result)
            self.assertLess(execution_time, 0.005)  # 5ms max per edge case
            
    def test_error_handling_performance(self):
        """Test error handling with minimal performance impact"""
        start = time.perf_counter()
        
        with self.assertRaises(Exception):
            {{FUNCTION_NAME}}({'force_error': True})
            
        execution_time = time.perf_counter() - start
        
        # Error handling should be fast
        self.assertLess(execution_time, 0.01)
    
    def test_caching_effectiveness(self):
        """Test caching for repeated operations"""
        cache_test_data = {'id': 999, 'cacheable': True}
        
        # First execution (cache miss)
        start = time.perf_counter()
        result1 = {{FUNCTION_NAME}}(cache_test_data)
        first_execution = time.perf_counter() - start
        
        # Second execution (cache hit)
        start = time.perf_counter()
        result2 = {{FUNCTION_NAME}}(cache_test_data)
        second_execution = time.perf_counter() - start
        
        # Verify caching improves performance
        self.assertEqual(result1, result2)
        if hasattr({{FUNCTION_NAME}}, 'cache'):
            self.assertLess(second_execution, first_execution * 0.5)

if __name__ == '__main__':
    # Run with performance timing
    unittest.main(verbosity=2, buffer=True)
```

## High-Performance Integration Test Template

```javascript
// LINCE - {{TEST_NAME}} High-Performance Integration Tests
// Optimized for rapid feedback and agile development

const request = require('supertest');
const app = require('{{TARGET_FILE}}');
const { performance } = require('perf_hooks');

describe('{{TEST_NAME}} - LINCE Integration Performance', () => {
  let testServer;
  let performanceMetrics = {};
  
  beforeAll(async () => {
    // Fast server setup
    performanceMetrics.setupStart = performance.now();
    testServer = app.listen(0);
    performanceMetrics.setupTime = performance.now() - performanceMetrics.setupStart;
    
    // LINCE requirement: Fast setup
    expect(performanceMetrics.setupTime).toBeLessThan(1000); // 1 second max
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.close();
    }
  });
  
  test('should handle high-throughput requests', async () => {
    // Simulate high-load scenario
    const concurrentRequests = Array(50).fill().map((_, i) =>
      request(testServer)
        .post('/api/{{FUNCTION_NAME}}')
        .send({ id: i, highThroughput: true })
        .expect(200)
    );
    
    const startTime = performance.now();
    const responses = await Promise.all(concurrentRequests);
    const totalTime = performance.now() - startTime;
    
    // LINCE performance validation
    expect(responses).toHaveLength(50);
    expect(totalTime).toBeLessThan(2000); // 2 seconds for 50 requests
    
    responses.forEach(response => {
      expect(response.body.success).toBe(true);
    });
  });
  
  test('should optimize response times under load', async () => {
    const response = await request(testServer)
      .post('/api/{{FUNCTION_NAME}}')
      .send({
        data: Array(1000).fill({ item: 'load_test' }),
        optimize: true
      })
      .expect(200);
    
    // Verify response includes performance metrics
    expect(response.headers['x-execution-time']).toBeDefined();
    const executionTime = parseFloat(response.headers['x-execution-time']);
    expect(executionTime).toBeLessThan(100); // 100ms max response time
    
    expect(response.body.success).toBe(true);
  });
  
  test('should handle circuit breaker scenarios', async () => {
    // Test resilience patterns for LINCE agility
    const failureRequests = Array(10).fill().map(() =>
      request(testServer)
        .post('/api/{{FUNCTION_NAME}}')
        .send({ simulateFailure: true })
    );
    
    const responses = await Promise.allSettled(failureRequests);
    
    // Circuit breaker should prevent cascading failures
    const successCount = responses.filter(r => r.status === 'fulfilled').length;
    expect(successCount).toBeGreaterThanOrEqual(0); // Graceful degradation
  });
});
```
