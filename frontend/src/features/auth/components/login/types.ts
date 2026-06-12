export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginMutationData {
  login: {
    message: string;
  };
}

export interface LoginMutationVariables {
  emailAddress: string;
  password: string;
}

export interface CompanyProfile {
  userId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  emailAddress: string;
  companyName: string;
  address: string;
  phoneNumber: string;
  role: string;
}
