// lib/pdfGenerator.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateStatementPDF = (summaryData, member) => {
    const doc = new jsPDF();

    const summary = summaryData?.monthly_summary || [];
    const bFSummary = summaryData?.monthly_summary?.[0] || {};
    const currentYear = summaryData?.year || new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Helper to safely access nested properties and find by type
    const getAmount = (monthData, section, typePattern, field) => {
        if (!monthData || !monthData[section]) return 0;

        // Handle Guarantees (no 'by_type' array)
        if (section === 'guarantees') {
            return monthData.guarantees?.[field] || 0;
        }

        const list = monthData[section]?.by_type || [];

        // Sum of all types identifying as LOAN but NOT Instant Loan
        if (typePattern === 'NOT_INSTANT_LOAN') {
            return list.reduce((sum, item) => {
                if (!item.loan_type?.match(/Instant Loan/i)) {
                    return sum + (Number(item[field]) || 0);
                }
                return sum;
            }, 0);
        }

        const item = list.find(i => {
            const typeName = i.type || i.loan_type || i.venture_type || "";
            return typeName.match(typePattern);
        });

        return item ? (Number(item[field]) || 0) : 0;
    };

    const format = (val) => 
        Number(val || 0).toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });

    // ────────────────────────────────────────────────
    // Header Section
    // ────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.text("TAMARIND SACCO LTD", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("Member's Statement", 105, 22, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Member's Name: ${member?.first_name || ""} ${member?.last_name || ""}`, 14, 30);
    doc.text(`Account No: ${member?.member_no || ""}`, 14, 35);
    doc.text(`Employer: Tamarind Sacco Ltd`, 150, 30);

    // ────────────────────────────────────────────────
    // Table Configuration
    // ────────────────────────────────────────────────
    const head = [
        [
            { content: 'DATE', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
            { content: 'SHARES', colSpan: 1, styles: { halign: 'center' } },
            { content: 'DEPOSITS', colSpan: 3, styles: { halign: 'center' } },
            { content: 'LOANS', colSpan: 4, styles: { halign: 'center' } },
            { content: 'INSTANT LOANS', colSpan: 4, styles: { halign: 'center' } },
            { content: 'OTHER DEDUCTIONS', colSpan: 4, styles: { halign: 'center' } },
        ],
        [
            // Shares
            { content: 'Balance', styles: { halign: 'right' } },
            // Deposits
            { content: 'RECEIVED', styles: { halign: 'right' } },
            { content: 'W/DRAW', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            // Loans
            { content: 'LOANED', styles: { halign: 'right' } },
            { content: 'REPAID', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            { content: 'INTEREST', styles: { halign: 'right' } },
            // Instant Loans
            { content: 'LOANED', styles: { halign: 'right' } },
            { content: 'REPAID', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            { content: 'INTEREST', styles: { halign: 'right' } },
            // Other Deductions
            { content: 'HOLIDAY', styles: { halign: 'right' } },
            { content: 'GUARANTEE', styles: { halign: 'right' } },
            { content: 'SODA', styles: { halign: 'right' } },
            { content: 'TOTAL', styles: { halign: 'right' } },
        ]
    ];

    const body = [];

    // Balance Brought Forward Row
    body.push([
        `${previousYear} - BF`,
        format(getAmount(bFSummary, 'savings', /Share Capital/i, 'balance_brought_forward')),
        "", "", 
        format(getAmount(bFSummary, 'savings', /Member Contribution/i, 'balance_brought_forward')),
        "", "", 
        format(getAmount(bFSummary, 'loans', 'NOT_INSTANT_LOAN', 'balance_brought_forward')),
        "",
        "", "", 
        format(getAmount(bFSummary, 'loans', /Instant Loan/i, 'balance_brought_forward')),
        "",
        format(getAmount(bFSummary, 'savings', /Holiday/i, 'balance_brought_forward')),
        "0.00",
        format(getAmount(bFSummary, 'ventures', /Sodas/i, 'balance_brought_forward')),
        "",
    ]);

    // Monthly rows
    summary?.forEach(r => {
        const totalDeductions =
            getAmount(r, 'savings', /Holiday/i, 'total_deposits') +
            getAmount(r, 'guarantees', null, 'new_guarantees') +
            getAmount(r, 'ventures', /Sodas/i, 'balance_carried_forward');

        body.push([
            r?.month?.split(' ')?.[0] || '-',
            format(getAmount(r, 'savings', /Share Capital/i, 'balance_carried_forward')),
            format(getAmount(r, 'savings', /Member Contribution/i, 'total_deposits')),
            "0.00",
            format(getAmount(r, 'savings', /Member Contribution/i, 'balance_carried_forward')),
            format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_disbursed')),
            format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_repaid')),
            format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_amount_outstanding')),
            format(getAmount(r, 'loans', 'NOT_INSTANT_LOAN', 'total_interest_charged')),
            format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_disbursed')),
            format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_repaid')),
            format(getAmount(r, 'loans', /Instant Loan/i, 'total_amount_outstanding')),
            format(getAmount(r, 'loans', /Instant Loan/i, 'total_interest_charged')),
            format(getAmount(r, 'savings', /Holiday/i, 'total_deposits')),
            format(getAmount(r, 'guarantees', null, 'new_guarantees')),
            format(getAmount(r, 'ventures', /Sodas/i, 'balance_carried_forward')),
            format(totalDeductions),
        ]);
    });

    // Generate the table using the function import (most reliable in modern Next.js)
    autoTable(doc, {
        startY: 40,
        head: head,
        body: body,
        theme: 'grid',
        styles: { 
            fontSize: 7, 
            cellPadding: 1, 
            overflow: 'linebreak', 
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        },
        headStyles: { 
            fillColor: [220, 220, 220], 
            textColor: 20, 
            fontStyle: 'bold', 
            halign: 'center',
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 16 },                    // DATE
            1: { halign: 'right' },                  // SHARES Balance
            2: { halign: 'right' },                  // DEPOSITS RECEIVED
            3: { halign: 'right' },                  // W/DRAW
            4: { halign: 'right' },                  // BALANCE
            5: { halign: 'right' },                  // LOANS LOANED
            6: { halign: 'right' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },                  // INSTANT LOANS LOANED
            10: { halign: 'right' },
            11: { halign: 'right' },
            12: { halign: 'right' },
            13: { halign: 'right' },                 // OTHER DEDUCTIONS
            14: { halign: 'right' },
            15: { halign: 'right' },
            16: { halign: 'right', fontStyle: 'bold', textColor: [0, 0, 139] }, // TOTAL (darker blue)
        },
        didParseCell: (data) => {
            if (data.row.index === 0 && data.section === 'body') {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [245, 245, 245];
            }
        },
        margin: { top: 40, left: 14, right: 14 }
    });

    // Optional: Add page numbers or footer if needed
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
    }

    doc.save(`${member?.member_no || 'Member'}_Statement_${currentYear}.pdf`);
};