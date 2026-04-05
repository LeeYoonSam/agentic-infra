import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: '시작하기',
      items: ['intro/index', 'intro/quick-start', 'intro/installation'],
    },
    {
      type: 'category',
      label: '핵심 개념',
      items: [
        'concepts/client-server',
        'concepts/api-basics',
        'concepts/database-basics',
        'concepts/auth-basics',
        'concepts/serverless',
      ],
    },
    {
      type: 'category',
      label: '용어 사전',
      items: [
        'glossary/network',
        'glossary/backend',
        'glossary/database',
        'glossary/auth',
        'glossary/infra',
      ],
    },
    {
      type: 'category',
      label: '아키텍처',
      items: [
        'architecture/supabase',
        'architecture/aws',
        'architecture/hybrid',
      ],
    },
    {
      type: 'category',
      label: '가이드',
      items: [
        'guides/ralph-usage',
      ],
    },
  ],
};

export default sidebars;
