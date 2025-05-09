export const getPieData = (pie: number[]) => ({
  labels: ["PAID", "UNPAID"],
  datasets: [
    {
      label: "# of Invoices",
      data: pie,
      backgroundColor: ["rgb(0,100,0, 0.2)", "rgba(255, 99, 132, 0.5)"],
      borderColor: ["rgb(0,100,0, 1)", "rgba(255, 99, 132, 0.5)"],
      borderWidth: 1,
    },
  ],
});
