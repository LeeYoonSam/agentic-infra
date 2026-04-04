#!/bin/bash
PASS=0; FAIL=0
check() {
  if [ "$2" = "true" ]; then echo "  PASS: $1"; ((PASS++)); else echo "  FAIL: $1"; ((FAIL++)); fi
}

echo "=== Step 2.2: AWS 풀 템플릿 Verification ==="

check "cdk-stack.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/cdk-stack.ts.ejs ] && echo true || echo false)"
check "cdk에 Lambda" "$(grep -q 'lambda.Function' packages/cli/src/templates/aws/cdk-stack.ts.ejs && echo true || echo false)"
check "cdk에 API Gateway" "$(grep -q 'RestApi' packages/cli/src/templates/aws/cdk-stack.ts.ejs && echo true || echo false)"
check "lambda-crud.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/lambda-crud.ts.ejs ] && echo true || echo false)"
check "lambda에 CRUD" "$(grep -q 'handlePost' packages/cli/src/templates/aws/lambda-crud.ts.ejs && echo true || echo false)"
check "api-gateway.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/api-gateway.ts.ejs ] && echo true || echo false)"
check "api-gateway에 CORS" "$(grep -q 'corsConfig' packages/cli/src/templates/aws/api-gateway.ts.ejs && echo true || echo false)"
check "dynamodb-table.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/dynamodb-table.ts.ejs ] && echo true || echo false)"
check "dynamodb에 PK/SK" "$(grep -q 'partitionKey' packages/cli/src/templates/aws/dynamodb-table.ts.ejs && echo true || echo false)"
check "cognito-auth.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/cognito-auth.ts.ejs ] && echo true || echo false)"
check "cognito에 signUp" "$(grep -q 'signUp' packages/cli/src/templates/aws/cognito-auth.ts.ejs && echo true || echo false)"
check "s3-storage.ts.ejs 존재" "$([ -f packages/cli/src/templates/aws/s3-storage.ts.ejs ] && echo true || echo false)"
check "s3에 uploadFile" "$(grep -q 'uploadFile' packages/cli/src/templates/aws/s3-storage.ts.ejs && echo true || echo false)"
check "generator가 features 조건부" "$(grep -q 'features.includes' packages/cli/src/generators/aws-generator.ts && echo true || echo false)"
check "TypeScript 컴파일" "$(cd packages/cli && npx tsc --noEmit 2>&1 && echo true || echo false)"

echo ""; echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
