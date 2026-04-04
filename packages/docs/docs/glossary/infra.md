---
sidebar_position: 5
---

# 인프라/배포 용어

## 클라우드 (Cloud)

**한줄 정의:** 인터넷 어딘가의 컴퓨터(서버)를 빌려서 사용하는 서비스

**쉬운 비유:** 아파트입니다. 내 서버(집)를 사지 않고, 빌려서 사용합니다.

```typescript
// 클라우드 서비스 종류
AWS (Amazon Web Services)
Google Cloud Platform (GCP)
Microsoft Azure
```

**관련 용어:** [서버리스](#서버리스), [IaC](#iac-infrastructure-as-code)

---

## IaC (Infrastructure as Code)

**한줄 정의:** 클라우드 인프라를 코드로 정의하고 관리하는 방식

**쉬운 비유:** 인테리어 계획을 설계도로 그리고, 설계도대로 시공합니다. 재현성이 높습니다.

```typescript
// Terraform IaC 예시
resource "aws_ec2_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "my-web-server"
  }
}
```

**관련 용어:** [CloudFormation](#cloudformation), [CDK](#cdk)

---

## CI/CD (Continuous Integration / Continuous Deployment)

**한줄 정의:** 코드 변경을 자동으로 테스트하고 배포하는 자동화 파이프라인

**쉬운 비유:** 자동차 조립 라인입니다. 한 부품이 들어오면 자동으로 다음 과정으로 넘어갑니다.

```yaml
# GitHub Actions CI/CD 예시
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
      - run: npm run build
      - run: deploy-to-production
```

**관련 용어:** [배포](#배포), [자동화](#자동화)

---

## Docker

**한줄 정의:** 애플리케이션과 필요한 모든 것(라이브러리, 런타임)을 하나의 상자(컨테이너)에 묶는 도구

**쉬운 비유:** 레고 블록입니다. 어디서나 같은 모양으로 조립되고, 어디서나 같은 결과가 나옵니다.

```dockerfile
# Dockerfile 예시
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

**관련 용어:** [Kubernetes](#kubernetes), [컨테이너](#컨테이너)

---

## Kubernetes

**한줄 정의:** Docker 컨테이너들을 대규모로 관리하고 자동으로 확장하는 오케스트레이션 도구

**쉬운 비유:** 데이터센터의 감시카메라 시스템입니다. 모든 일꾼(컨테이너)이 제대로 일하는지 감시합니다.

```yaml
# Kubernetes 배포 설정
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: my-app:1.0
        ports:
        - containerPort: 3000
```

**관련 용어:** [Docker](#docker), [컨테이너](#컨테이너), [오토스케일링](#오토스케일링)

---

## 로드 밸런서 (Load Balancer)

**한줄 정의:** 들어오는 요청들을 여러 서버에 균등하게 배분하는 장비

**쉬운 비유:** 카페의 계산대입니다. 한 직원이 바빠도 다른 직원으로 안내합니다.

```
클라이언트 요청
     ↓
 로드 밸런서
   ↙ ↓ ↘
서버1 서버2 서버3
```

**관련 용어:** [확장성](#확장성), [고가용성](#고가용성)

---

## CDK (AWS Cloud Development Kit)

**한줄 정의:** 프로그래밍 언어(TypeScript, Python 등)로 AWS 리소스를 정의하는 도구

**쉬운 비유:** 청사진을 그리는 대신 프로그래밍으로 정의합니다. 더 동적이고 유연합니다.

```typescript
// AWS CDK 예시
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    new s3.Bucket(this, 'MyBucket');
  }
}
```

**관련 용어:** [IaC](#iac-infrastructure-as-code), [CloudFormation](#cloudformation)

---

## CloudFormation

**한줄 정의:** AWS의 IaC 서비스. YAML/JSON으로 AWS 리소스를 정의

**쉬운 비유:** IKEA 가구의 조립 설명서입니다. 그대로 따르면 똑같은 결과가 나옵니다.

```yaml
# CloudFormation 템플릿 예시
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name
```

**관련 용어:** [IaC](#iac-infrastructure-as-code), [CDK](#cdk)

---

## 서버리스 (Serverless)

**한줄 정의:** 서버를 관리하지 않고도 코드를 실행할 수 있는 클라우드 아키텍처

**쉬운 비유:** 우버입니다. 차를 소유하지 않고, 필요할 때만 이용합니다.

```typescript
// AWS Lambda (서버리스) 함수
export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('Hello World!')
  };
};
```

**관련 용어:** [Lambda](#lambda), [클라우드](#클라우드-cloud)

---

## 모니터링 (Monitoring)

**한줄 정의:** 애플리케이션과 인프라의 상태를 계속 감시하고 문제를 감지하는 것

**쉬운 비유:** 병원의 생명 유지 장비입니다. 심장 박동, 혈압 등을 계속 감시합니다.

```typescript
// 모니터링 메트릭 예시
- CPU 사용률
- 메모리 사용률
- 응답 시간
- 에러율
- 요청 수
```

**관련 용어:** [로깅](#로깅), [알림](#알림)

---

## 배포 (Deployment)

**한줄 정의:** 완성된 애플리케이션을 프로덕션 서버에 올리는 과정

**쉬운 비유:** 영화를 극장에 개봉하는 것입니다.

```bash
# 배포 프로세스
1. 코드 변경 → Git에 커밋
2. CI/CD 파이프라인 자동 실행
3. 테스트 통과
4. 프로덕션 서버에 배포
```

**관련 용어:** [CI/CD](#cicd-continuous-integration--continuous-deployment), [롤백](#롤백)

---

## 로깅 (Logging)

**한줄 정의:** 애플리케이션의 실행 내역을 기록하는 것

**쉬운 비유:** 일기장입니다. 무슨 일이 일어났는지 기록해뒀다가 나중에 확인합니다.

```typescript
// 로깅 예시
console.log('사용자 로그인: user123');
logger.error('데이터베이스 연결 실패');
logger.warn('메모리 사용률 90% 초과');
```

**관련 용어:** [모니터링](#모니터링), [디버깅](#디버깅)

---

## 컨테이너 (Container)

**한줄 정의:** 애플리케이션과 그 의존성들을 격리된 환경에 담은 것

**쉬운 비유:** 배송용 컨테이너입니다. 내용물이 어떻든 규격이 같으면 어디서나 처리 가능합니다.

**관련 용어:** [Docker](#docker), [Kubernetes](#kubernetes)

---

## 오토스케일링 (Auto Scaling)

**한줄 정의:** 트래픽에 따라 자동으로 서버의 개수를 증가/감소시키는 기능

**쉬운 비유:** 햄버거 가게입니다. 점심시간에는 직원을 더 고용하고, 한산할 때는 줄입니다.

```yaml
# Kubernetes 오토스케일링
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**관련 용어:** [Kubernetes](#kubernetes), [확장성](#확장성)

---

## 고가용성 (High Availability)

**한줄 정의:** 서버가 다운되어도 서비스가 계속 되는 상태

**쉬운 비유:** 비행기의 엔진입니다. 엔진 하나가 고장나도 다른 엔진이 작동하도록 설계합니다.

**관련 용어:** [로드 밸런서](#로드-밸런서-load-balancer), [중복성](#중복성)
