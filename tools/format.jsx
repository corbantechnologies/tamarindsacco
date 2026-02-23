export const formatCurrency = (val) => {
    return Number(val || 0).toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
    });
};

export const formatNumber = (n) => {
    return Number(n || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
