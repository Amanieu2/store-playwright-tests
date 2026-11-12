/** Public demo credentials published on the SauceDemo login page. */
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;

export const customer = {
  firstName: 'Petr',
  lastName: 'Tester',
  postalCode: '100000',
};

/** Public demo account published in the DummyJSON docs. */
export const apiUser = {
  username: process.env.API_USER ?? 'emilys',
  password: process.env.API_PASSWORD ?? 'emilyspass',
};
