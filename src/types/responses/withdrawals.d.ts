
type Withdrawal = {
    user: id;  // ISO 8601 date string
    id: number; // Numeric ID
    amount: number; // Referred user's ID
    date: string; // Email of the referred user
    type: string
    payed_date: string
    payment_link: string
    status: string
    fee: number
}

type WithdrawalsResponse = {
    count: number; // Total count of referrals
    links: Links; // Links for pagination
    results: Withdrawal[]; // Array of Referral objects
    total_pages: number; // Total number of pages
}