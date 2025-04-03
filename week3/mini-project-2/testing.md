1. Testing Strategy: We use unit, integration, and end-to-end tests. Unit tests focus on individual methods, integration tests verify component interactions, and end-to-end tests simulate real-world scenarios. High coverage and edge case handling ensure app stability.

2. AI-Assisted Testing: Tools: GitHub Copilot was used to generate tests. It speeds up test creation with context-aware suggestions.
Example Prompts:
"Generate unit tests for getAllProducts with filters."
"Write integration tests for POST /api/products."
"Improve test coverage for updateProduct, focusing on edge cases."

Results: Screenshots stored in the folder.

3. Test Coverage: After running npm run test:coverage, the results were:
Statements: 85%
Branches: 80%
Functions: 90%
Lines: 88%

4. Challenges and Solutions:
Context Gaps: AI-generated tests lacked context.
Solution: Refined tests manually.
Edge Cases: AI missed some edge cases.
Solution: Added manual tests.
Dependencies: Integration tests with external dependencies required extra setup.
Solution: Used mocks and test databases.

5. Lessons Learned:
AI tools speed up test creation, especially for common cases.
Good prompts lead to better test quality.
Manual review ensures accuracy.
Combining AI and manual testing gives the best results.