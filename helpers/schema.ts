export const schema = {
  currencies: {
    type: "currencies",
    fields: {
      name: "string",
      total_sold: "string",
      config: "object",
      details: "object",
      deposit_enabled: "boolean",
      withdrawal_enabled: "boolean",
    },
    relationships: {
      icos: {
        type: "icos",
      },
      payment_currencies: {
        type: "payment_currencies",
      },
    },
  },
  payment_currencies: {
    type: "payment_currencies",
    fields: {
      provider_rate: "string",
      currency_details: "object",
    },
    relationships: {
      ico: {
        type: "icos",
      },
      currency: {
        type: "currencies",
      },
    },
  },
  icos: {
    type: "icos",
    fields: {
      name: "string",
      total_sold: "string",
      config: "object",
    },
    relationships: {
      currency: {
        type: "currencies",
      },
      ico_stages: {
        type: "ico_stages",
      },
      current_stage: {
        type: "ico_stages",
      },
      next_stage: {
        type: "ico_stages",
      },
      payment_currencies: {
        type: "payment_currencies",
      },
    },
  },
  ico_stages: {
    type: "ico_stages",
    fields: {
      name: "string",
      total_sold: "string",
      base_price: "string",
      min_purchase: "string",
      max_purchase: "string",
      soft_cap: "string",
      hard_cap: "string",
      status: "string",
      start_date: "string",
      end_date: "string",
      config: "object",
    },
    relationships: {
      ico: {
        type: "icos",
      },
    },
  },
  ico_transactions: {
    type: "ico_transactions",
    fields: {
      price: "string",
      amount: "string",
      tokens: "string",
      bonus_on_amount: "string",
      total: "string",
      txn_id: "string",
      txn_type: "string",
      status: "string",
      created_at: "datetime",
    },
    relationships: {
      ico_stage: {
        type: "ico_stages",
      },
      payment_currency: {
        type: "payment_currencies",
      },
    },
  },
  referrals: {
    type: "referrals",
    fields: {
      name: "string",
      commission: "string",
      created_at: "datetime",
    },
    relationships: {},
  },
  withdraws: {
    type: "withdraws",
    fields: {
      amount: "string",
      fee: "string",
      sum: "string",
      rid: "string",
      tid: "string",
      status: "string",
      created_at: "datetime",
    },
    relationships: {
      currency: "currencies",
    },
  },
};
