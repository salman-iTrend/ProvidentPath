# ProvidentPath

ProvidentPath is a small, browser-based EPF tool for estimating monthly take-home pay and exploring how provident fund savings may grow over time. It uses plain HTML, CSS, and JavaScript; no installation, account, or backend is required.

## Open the app

Open `index.html` in a modern web browser. The Google Fonts used for the design need an internet connection; the calculator itself runs locally in your browser.

## Take-home pay

Open the **Take-home pay** tab and enter your monthly gross cash salary, Basic + DA, income-tax TDS from your payslip, and other deductions. The calculator compares:

- **Capped PF:** 12% of Basic + DA up to ₹15,000.
- **Full-basic PF:** 12% of the full Basic + DA amount.

It subtracts employee PF, entered TDS, and other deductions from gross salary to estimate in-hand pay. Employer PF is not subtracted from take-home pay. Enter gross cash salary, not CTC.

These are comparison scenarios, not a claim that EPF rules changed from one method to the other. Which PF wage basis applies depends on the employee's circumstances and employer payroll policy.

## EPF growth

Open the **EPF growth** tab to estimate a future EPF balance. You can change:

- Monthly Basic + DA and current EPF balance
- Employee and employer EPF contribution percentages
- Expected annual salary increase and interest rate
- Current age and retirement age

The results include projected balance, employee and employer contributions, estimated interest, a year-by-year chart, and a table. The default assumptions are 12% employee contribution, 3.67% employer EPF contribution, 5% annual salary increase, 8.25% annual interest, and retirement at age 58. Change the interest rate to reflect the rate you want to model.

## Estimates and limitations

This tool is for illustration and planning, not payroll, tax, or EPFO advice. The take-home calculator uses the monthly TDS you enter; it does not calculate income tax from gross salary. The growth projection applies a constant annual interest rate as a monthly rate and increases salary once a year. Actual EPF interest, eligible wages, employer contributions, EPS allocation, tax, and account balances can differ. Check your payslip and EPFO records for actual values.
