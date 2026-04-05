# Test Templates - ORGANIC

## JavaScript/TypeScript Unit Test Template

```javascript
// ORGANIC - {{TEST_NAME}} Unit Tests
// Sustainable and maintainable testing approach
// Environmental impact: Optimized for efficiency

const { {{FUNCTION_NAME}} } = require('{{TARGET_FILE}}');

describe('{{TEST_NAME}}', () => {
  // Setup and teardown with resource optimization
  beforeAll(() => {
    // Initialize resources efficiently
  });

  afterAll(() => {
    // Clean up resources sustainably
  });

  beforeEach(() => {
    // Reset state for test isolation
  });

  // Main test cases following ORGANIC principles
  test('should handle basic functionality correctly', () => {
    // Arrange - Sustainable data setup
    const inputData = {
      // Minimal required data for testing
    };
    const expected = true;
    
    // Act - Execute function under test
    const result = {{FUNCTION_NAME}}(inputData);
    
    // Assert - Verify results with clear expectations
    expect(result).toBe(expected);
  });

  test('should handle edge cases gracefully', () => {
    // Test boundary conditions
    expect(() => {{FUNCTION_NAME}}(null)).not.toThrow();
    expect({{FUNCTION_NAME}}(undefined)).toBeDefined();
  });

  test('should validate input parameters', () => {
    // Test input validation
    const invalidInput = {};
    expect(() => {{FUNCTION_NAME}}(invalidInput)).toThrow('Invalid input');
  });

  test('should be performant and resource-efficient', () => {
    // Performance test aligned with ORGANIC sustainability values
    const startTime = Date.now();
    const largeDataset = Array(1000).fill().map((_, i) => ({ id: i }));
    
    const result = {{FUNCTION_NAME}}(largeDataset);
    
    const executionTime = Date.now() - startTime;
    expect(executionTime).toBeLessThan(100); // ms
    expect(result).toBeDefined();
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should handle errors gracefully', () => {
      const errorInput = { forceError: true };
      expect(() => {{FUNCTION_NAME}}(errorInput)).toThrow();
    });
  });
});
```

## Python Unit Test Template

```python
# ORGANIC - {{TEST_NAME}} Unit Tests
# Sustainable testing with environmental consciousness
# Resource-optimized testing approach

import unittest
from unittest.mock import Mock, patch
from {{TARGET_FILE}} import {{FUNCTION_NAME}}

class Test{{TEST_NAME}}(unittest.TestCase):
    """
    Comprehensive test suite following ORGANIC principles:
    - Sustainable resource usage
    - Clear and maintainable code
    - Environmental impact consideration
    """
    
    def setUp(self):
        """Set up test fixtures with minimal resource usage"""
        self.test_data = {
            'id': 1,
            'name': 'test_item'
        }
        
    def tearDown(self):
        """Clean up resources efficiently"""
        # Cleanup any created resources
        pass
    
    def test_basic_functionality(self):
        """Test basic functionality with clear expectations"""
        # Arrange
        input_data = self.test_data
        expected_result = True
        
        # Act
        result = {{FUNCTION_NAME}}(input_data)
        
        # Assert
        self.assertEqual(result, expected_result)
        
    def test_edge_cases(self):
        """Test boundary conditions and edge cases"""
        # Test with None
        result = {{FUNCTION_NAME}}(None)
        self.assertIsNotNone(result)
        
        # Test with empty data
        result = {{FUNCTION_NAME}}({})
        self.assertIsInstance(result, (bool, dict, list))
        
    def test_input_validation(self):
        """Test input parameter validation"""
        with self.assertRaises(ValueError):
            {{FUNCTION_NAME}}("invalid_input")
            
    def test_performance_sustainability(self):
        """Test performance with sustainability focus"""
        import time
        
        start_time = time.time()
        
        # Test with larger dataset
        large_dataset = [{'id': i} for i in range(1000)]
        result = {{FUNCTION_NAME}}(large_dataset)
        
        execution_time = time.time() - start_time
        
        # Should be efficient (< 100ms for sustainability)
        self.assertLess(execution_time, 0.1)
        self.assertIsNotNone(result)
    
    @patch('{{TARGET_FILE}}.external_dependency')
    def test_with_mocks(self, mock_dependency):
        """Test with mocked dependencies for isolation"""
        # Arrange
        mock_dependency.return_value = {'status': 'success'}
        
        # Act
        result = {{FUNCTION_NAME}}(self.test_data)
        
        # Assert
        mock_dependency.assert_called_once()
        self.assertTrue(result)

if __name__ == '__main__':
    # Run tests with detailed output
    unittest.main(verbosity=2)
```

## Integration Test Template

```javascript
// ORGANIC - {{TEST_NAME}} Integration Tests
// Sustainable integration testing approach

const request = require('supertest');
const app = require('{{TARGET_FILE}}');

describe('{{TEST_NAME}} Integration Tests', () => {
  let testServer;
  
  beforeAll(async () => {
    // Setup test environment sustainably
    testServer = app.listen(0); // Use random available port
  });
  
  afterAll(async () => {
    // Clean up resources
    if (testServer) {
      await testServer.close();
    }
  });
  
  test('should handle full integration flow', async () => {
    const response = await request(testServer)
      .post('/api/{{FUNCTION_NAME}}')
      .send({
        data: 'test_data',
        sustainabilityMode: true
      })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });
  
  test('should handle error scenarios gracefully', async () => {
    const response = await request(testServer)
      .post('/api/{{FUNCTION_NAME}}')
      .send({
        invalid: 'data'
      })
      .expect(400);
    
    expect(response.body.error).toBeDefined();
  });
});
```
