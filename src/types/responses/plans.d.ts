type InvestmentPlan = {
  id: number
  start_price: number
  end_price: number
  name: string
  details: string
  is_in_discount: boolean
  pasive_percentage: number
  direct_bonus: number
  discount_price: number
  binary_bonus: number
  renovation_precentage: number
  coinbase_guarantee: boolean
}

type PaymentPlanResponse = {
  error: string;
  result: {
    amount: string;
    txn_id: string;
    address: string;
    confirms_needed: string;
    timeout: number;
    checkout_url: string;
    status_url: string;
    qrcode_url: string;
  };
};

type InvestmentHistory = {
  id: number;
  amount: string;
  coinpayments_response: object;
  status: string;
  date: string;
  txn_id: string;
  pay_with_balance: boolean;
  levels_paid: boolean;
  current_investment: number;
  before_investment_value: number
};


type InvestmentHistoryResponse = {
  count: number; // Total count of referrals
  links: Links; // Links for pagination
  results: InvestmentHistory[]; // Array of Referral objects
  total_pages: number; // Total number of pages
}