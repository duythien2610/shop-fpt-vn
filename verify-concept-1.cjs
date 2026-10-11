// Current shared purchase and UI checks; replaces the historical journey checks.
process.env.AM_TEST_CONCEPT='1';
require('./verify-v4.cjs');
