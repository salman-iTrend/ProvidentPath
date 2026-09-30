const grossInput = document.getElementById('grossSalary');
const basicInput = document.getElementById('basicSalary');
const taxInput = document.getElementById('taxDeduction');
const otherDeductionsInput = document.getElementById('otherDeductions');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function readAmount(input) {
  return Math.max(0, Number(input.value) || 0);
}

function readPercentage(input) {
  return Math.min(100, readAmount(input)) / 100;
}

function calculateEPF() {
  const grossSalary = readAmount(grossInput);
  const basicSalary = Math.min(readAmount(basicInput), grossSalary);
  const taxDeduction = readAmount(taxInput);
  const otherDeductions = readAmount(otherDeductionsInput);

  const cappedPf = Math.min(basicSalary, 15000) * 0.12;
  const fullBasicPf = basicSalary * 0.12;
  const cappedTakeHome = grossSalary - cappedPf - taxDeduction - otherDeductions;
  const fullBasicTakeHome = grossSalary - fullBasicPf - taxDeduction - otherDeductions;
  const takeHomeDifference = Math.abs(cappedTakeHome - fullBasicTakeHome);

  document.getElementById('cappedPf').textContent = formatCurrency(cappedPf);
  document.getElementById('fullPf').textContent = formatCurrency(fullBasicPf);
  document.getElementById('cappedTakeHome').textContent = formatCurrency(cappedTakeHome);
  document.getElementById('fullTakeHome').textContent = formatCurrency(fullBasicTakeHome);
  document.getElementById('takeHomeDifference').textContent = formatCurrency(takeHomeDifference);
  document.getElementById('differenceDirection').textContent = takeHomeDifference === 0
    ? 'same take-home in both scenarios'
    : 'more in-hand with capped PF';
}

[grossInput, basicInput, taxInput, otherDeductionsInput].forEach((input) => {
  input.addEventListener('input', calculateEPF);
});

const growthInputs = [
  'growthSalary',
  'currentBalance',
  'employeeRate',
  'employerRate',
  'salaryIncrease',
  'interestRate',
  'currentAge',
  'retirementAge',
].map((id) => document.getElementById(id));

function calculateGrowth() {
  const [salaryInput, balanceInput, employeeRateInput, employerRateInput, increaseInput, interestInput, ageInput, retirementInput] = growthInputs;
  let monthlySalary = readAmount(salaryInput);
  let balance = readAmount(balanceInput);
  const openingBalance = balance;
  const employeeRate = readPercentage(employeeRateInput);
  const employerRate = readPercentage(employerRateInput);
  const annualIncrease = readPercentage(increaseInput);
  const monthlyInterestRate = readPercentage(interestInput) / 12;
  const currentAge = Math.min(75, Math.max(16, Math.round(readAmount(ageInput))));
  const retirementAge = Math.min(100, Math.max(currentAge + 1, Math.round(readAmount(retirementInput))));
  ageInput.value = String(currentAge);
  retirementInput.value = String(retirementAge);
  const years = retirementAge - currentAge;
  const annualResults = [];
  let employeeTotal = 0;
  let employerTotal = 0;
  let interestTotal = 0;

  for (let year = 1; year <= years; year += 1) {
    let yearlyEmployee = 0;
    let yearlyEmployer = 0;
    let yearlyInterest = 0;

    for (let month = 0; month < 12; month += 1) {
      const employeeContribution = monthlySalary * employeeRate;
      const employerContribution = monthlySalary * employerRate;
      balance += employeeContribution + employerContribution;
      const interest = balance * monthlyInterestRate;
      balance += interest;
      yearlyEmployee += employeeContribution;
      yearlyEmployer += employerContribution;
      yearlyInterest += interest;
    }

    employeeTotal += yearlyEmployee;
    employerTotal += yearlyEmployer;
    interestTotal += yearlyInterest;
    annualResults.push({
      age: currentAge + year,
      contributions: yearlyEmployee + yearlyEmployer,
      interest: yearlyInterest,
      balance,
    });
    monthlySalary *= 1 + annualIncrease;
  }

  document.getElementById('projectionPeriod').textContent = `${years} year${years === 1 ? '' : 's'} of projected contributions`;
  document.getElementById('projectedCorpus').textContent = formatCurrency(balance);
  document.getElementById('openingBalance').textContent = formatCurrency(openingBalance);
  document.getElementById('employeeTotal').textContent = formatCurrency(employeeTotal);
  document.getElementById('employerTotal').textContent = formatCurrency(employerTotal);
  document.getElementById('interestTotal').textContent = formatCurrency(interestTotal);

  const chart = document.getElementById('yearGrowthChart');
  const rows = document.getElementById('yearGrowthRows');
  const chartFragment = document.createDocumentFragment();
  const rowsFragment = document.createDocumentFragment();
  const maximumBalance = Math.max(...annualResults.map((result) => result.balance));

  annualResults.forEach((result, index) => {
    const column = document.createElement('div');
    column.className = 'chart-column';
    column.setAttribute('aria-hidden', 'true');

    const bar = document.createElement('span');
    bar.className = 'chart-bar';
    bar.style.height = `${Math.max(4, (result.balance / maximumBalance) * 100)}%`;
    column.append(bar);

    const yearLabel = document.createElement('span');
    yearLabel.textContent = `${index + 1}`;
    column.append(yearLabel);
    chartFragment.append(column);

    const row = document.createElement('tr');
    [result.age, formatCurrency(result.contributions), formatCurrency(result.interest), formatCurrency(result.balance)].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });
    rowsFragment.append(row);
  });

  chart.replaceChildren(chartFragment);
  rows.replaceChildren(rowsFragment);
}

growthInputs.forEach((input) => input.addEventListener('input', calculateGrowth));

const tabs = [
  { button: document.getElementById('takeHomeTab'), panel: document.getElementById('takeHomePanel') },
  { button: document.getElementById('growthTab'), panel: document.getElementById('growthPanel') },
];

function activateTab(activeTab) {
  tabs.forEach(({ button, panel }) => {
    const isActive = button === activeTab;
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
    button.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });
}

tabs.forEach(({ button }, index) => {
  button.addEventListener('click', () => activateTab(button));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length].button;
      activateTab(nextTab);
      nextTab.focus();
    }
  });
});

calculateEPF();
calculateGrowth();
