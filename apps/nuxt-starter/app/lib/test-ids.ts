export const TEST_IDS = {
  auth: {
    login: {
      form: 'login-form',
      email: 'login-form-email',
      password: 'login-form-password',
      submitButton: 'login-submit-button',
    },
  },
  table: {
    pagination: {
      limit: 'table-pagination-limit',
      limitOption: 'table-pagination-limit-option',
      previous: 'table-pagination-previous',
      next: 'table-pagination-next',
    },
  },
  toast: {
    status: 'toast-status',
    message: 'toast-message',
    close: 'toast-close',
  },
  imageCropperDialog: {
    cancelButton: 'image-cropper-dialog-cancel',
    applyButton: 'image-cropper-dialog-apply',
  },
  starter: {
    dashboard: 'starter-dashboard',
    card: 'starter-card',
    cardTitle: 'starter-card-title',
    cardDescription: 'starter-card-description',
    filterToggle: 'starter-filter-toggle',
    loading: 'starter-loading',
    error: 'starter-error',
    noData: 'starter-no-data',
  },
  assets: {
    search: 'assets-search',
    filterBtn: 'assets-filter-btn',
    addAssetBtn: 'assets-add-asset-btn',
    toggleStatus: 'assets-toggle-status-{id}',
    filter: {
      dialog: 'assets-filter-dialog',
      networkSelect: 'assets-filter-network-select',
      statusSelect: 'assets-filter-status-select',
    },
    availableAssetsForm: {
      networksSelect: 'available-assets-form-networks-select',
      search: 'available-assets-form-search',
      selectAllCheckbox: 'available-assets-form-select-all-checkbox',
      assetCheckbox: 'available-assets-form-asset-checkbox-{id}',
      cancelBtn: 'available-assets-form-cancel-btn',
      submitBtn: 'available-assets-form-submit-btn',
    },
    customTokenForm: {
      logo: 'custom-token-form-logo',
      name: 'custom-token-form-name',
      symbol: 'custom-token-form-symbol',
      network: 'custom-token-form-network',
      contractAddress: 'custom-token-form-contract-address',
      decimals: 'custom-token-form-decimals',
      cancelBtn: 'custom-token-form-cancel-btn',
      submitBtn: 'custom-token-form-submit-btn',
    },
  },
  tokenization: {
    search: 'tokenization-search',
    filterBtn: 'tokenization-filter-btn',
    addTokenBtn: 'tokenization-add-token-btn',
    verifyBtn: 'tokenization-verify-btn-{id}',
    filter: {
      dialog: 'tokenization-filter-dialog',
      networkSelect: 'tokenization-filter-network-select',
      statusSelect: 'tokenization-filter-status-select',
    },
  },
} as const;
