
export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  TOOL_VIEW = 'TOOL_VIEW',
  PLANS = 'PLANS'
}

export interface User {
  id?: string;
  name: string;
  email: string;
  credits: number;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  stripePriceId: string;
  highlight?: boolean;
}

export interface QuestionParams {
  grade: string;
  subject: string;
  count: number;
  discipline: string;
  context: string;
  language: string;
  bnccSkills: string[];
  bnccManualDetails?: string;
  additionalDetails: string;
  webSearch: boolean;
  fileData?: {
    mimeType: string;
    data: string; // base64
  } | null;
}

export interface SlideParams {
  discipline: string;
  grade: string;
  subject: string;
  count: number;
  duration: string;
  language: string;
  bnccSkills: string[];
  context: string;
  additionalDetails: string;
  webSearch: boolean;
  includeImages: boolean;
  fileData?: {
    mimeType: string;
    data: string; // base64
  } | null;
}

export interface LessonPlanParams {
  period: string;
  grade: string;
  discipline: string;
  multidisciplinary: boolean;
  days: string[];
  bnccSkills: string[];
  additionalDetails?: string;
}

// Fix: Augment both global JSX and React namespaces to ensure custom elements like stripe-buy-button are recognized
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-buy-button': any;
      }
    }
  }
}
