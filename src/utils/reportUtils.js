export const generateFinancialReport = async (finances, members) => {
  let report = 'Financial Report\n\n';

  const totalAmountPaid = members.reduce((sum, member) => sum + Number(member.amountPaid), 0);
  const totalFormFees = members.reduce((sum, member) => sum + Number(member.formFee), 0);
  const totalIncome = totalAmountPaid + totalFormFees;

  report += `Total Income: KSh ${totalIncome}\n`;
  report += `- Amount Paid: KSh ${totalAmountPaid}\n`;
  report += `- Total Form Fees: KSh ${totalFormFees}\n\n`;

  report += 'Pending Payments:\n';
  members.forEach(member => {
    const balance = Number(member.amountToBePaid) - Number(member.amountPaid);
    if (balance > 0) {
      report += `- ${member.fullName}: KSh ${balance}\n`;
    }
  });

  report += '\nTotal Expenses: KSh ';
  const totalExpenses = finances.reduce((sum, expense) => sum + Number(expense.amount), 0);
  report += totalExpenses + '\n';

  report += 'Expense Breakdown:\n';
  const expenseCategories = {};
  finances.forEach(expense => {
    if (expenseCategories[expense.expense]) {
      expenseCategories[expense.expense] += Number(expense.amount);
    } else {
      expenseCategories[expense.expense] = Number(expense.amount);
    }
  });
  Object.entries(expenseCategories).forEach(([category, amount]) => {
    report += `- ${category}: KSh ${amount}\n`;
  });

  report += `\nNet Balance: KSh ${totalIncome - totalExpenses}\n\n`;

  const completedPayments = members.filter(member => Number(member.amountToBePaid) === Number(member.amountPaid)).length;
  report += `Payment Status:\n`;
  report += `- Completed Payments: ${completedPayments}\n`;
  report += `- Incomplete Payments: ${members.length - completedPayments}\n\n`;

  const dates = finances.map(f => new Date(f.date)).filter(d => !isNaN(d.getTime()));
  report += `Financial Timeline:\n`;
  report += `- First Transaction: ${dates.length ? new Date(Math.min(...dates)).toISOString().split('T')[0] : 'N/A'}\n`;
  report += `- Latest Transaction: ${dates.length ? new Date(Math.max(...dates)).toISOString().split('T')[0] : 'N/A'}\n`;

  return { content: report };
};

export const generateMembersGroupsReport = async (members) => {
  let report = 'Members and Groups Report\n\n';

  report += `Total Members: ${members.length}\n`;
  const statusBreakdown = members.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {});
  report += 'Member Status Breakdown:\n';
  Object.entries(statusBreakdown).forEach(([status, count]) => {
    report += `- ${status}: ${count}\n`;
  });

  report += '\nMember Details:\n';
  members.forEach((member, index) => {
    report += `${index + 1}. Name: ${member.fullName}\n`;
    report += `   - National ID: ${member.nationalId}\n`;
    report += `   - Contact: ${member.contact}\n`;
    report += `   - Status: ${member.status}\n`;
    report += `   - Group Name: ${member.groupName}\n`;
    report += `   - Member Unique ID: ${member.memberUniqueId}\n`;
    report += `   - Date of Admission: ${member.dateOfAdmission}\n`;
    report += `   - Next of Kin: ${member.nextOfKin}\n`;
    report += `   - Next of Kin Contact: ${member.nextOfKinContact}\n\n`;
  });

  const locations = members.reduce((acc, member) => {
    acc.counties.add(member.county);
    acc.subCounties.add(member.subCounty);
    acc.wards.add(member.ward);
    return acc;
  }, { counties: new Set(), subCounties: new Set(), wards: new Set() });

  report += 'Geographical Distribution:\n';
  report += `- Counties: ${Array.from(locations.counties).join(', ')}\n`;
  report += `- Sub-Counties: ${Array.from(locations.subCounties).join(', ')}\n`;
  report += `- Wards: ${Array.from(locations.wards).join(', ')}\n\n`;

  const groups = members.reduce((acc, member) => {
    if (!acc[member.groupName]) {
      acc[member.groupName] = 0;
    }
    acc[member.groupName]++;
    return acc;
  }, {});

  report += 'Groups:\n';
  Object.entries(groups).forEach(([groupName, count]) => {
    report += `- ${groupName}: ${count} members\n`;
  });

  return { content: report };
};

export const generateProjectsReport = async (members, finances, lastProjectId) => {
  let report = 'Projects Report\n\n';

  report += `Last Project ID: ${lastProjectId}\n\n`;

  const seedlingOrders = members.reduce((acc, member) => {
    acc.total += Number(member.numberOfSeedlingsOrdered);
    acc.varieties[member.varietyOfSeedlings] = (acc.varieties[member.varietyOfSeedlings] || 0) + Number(member.numberOfSeedlingsOrdered);
    return acc;
  }, { total: 0, varieties: {} });

  report += 'Seedling Orders:\n';
  report += `- Total Seedlings Ordered: ${seedlingOrders.total}\n`;
  report += 'Varieties:\n';
  Object.entries(seedlingOrders.varieties).forEach(([variety, count]) => {
    report += `  - ${variety}: ${count}\n`;
  });

  const projectDates = members.map(m => new Date(m.dateOfAdmission)).filter(d => !isNaN(d.getTime()));
  report += '\nProject Timeline:\n';
  report += `- Project Start Date: ${projectDates.length ? new Date(Math.min(...projectDates)).toISOString().split('T')[0] : 'N/A'}\n`;

  report += '\nProject Locations:\n';
  const locations = members.reduce((acc, member) => {
    acc.counties.add(member.county);
    acc.subCounties.add(member.subCounty);
    acc.wards.add(member.ward);
    return acc;
  }, { counties: new Set(), subCounties: new Set(), wards: new Set() });

  report += `- Counties: ${Array.from(locations.counties).join(', ')}\n`;
  report += `- Sub-Counties: ${Array.from(locations.subCounties).join(', ')}\n`;
  report += `- Wards: ${Array.from(locations.wards).join(', ')}\n\n`;

  report += 'Financial Breakdown per Project:\n';
  report += `- Project ${lastProjectId}:\n`;
  const totalAmountToBePaid = members.reduce((sum, member) => sum + Number(member.amountToBePaid), 0);
  const totalAmountPaid = members.reduce((sum, member) => sum + Number(member.amountPaid), 0);
  const totalBalance = totalAmountToBePaid - totalAmountPaid;
  const totalFormFee = members.reduce((sum, member) => sum + Number(member.formFee), 0);

  report += `  * Total Amount to be Paid: KSh ${totalAmountToBePaid}\n`;
  report += `  * Amount Paid: KSh ${totalAmountPaid}\n`;
  report += `  * Balance: KSh ${totalBalance}\n`;
  report += `  * Form Fee: KSh ${totalFormFee}\n`;

  return { content: report };
};