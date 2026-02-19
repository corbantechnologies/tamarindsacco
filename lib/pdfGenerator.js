// lib/pdfGenerator.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Replace this with your actual Cloudinary URL
const LOGO_URL = "https://res.cloudinary.com/dhw8kulj3/image/upload/v1762838274/logoNoBg_umwk2o.png";

export const generateStatementPDF = async (summaryData, member) => {
    // Landscape A4
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const summary = summaryData?.monthly_summary || [];
    const bFSummary = summaryData?.monthly_summary?.[0] || {};
    const currentYear = summaryData?.year || new Date().getFullYear();
    const previousYear = currentYear - 1;

    // ────────────────────────────────────────────────
    // Helper functions
    // ────────────────────────────────────────────────
    const getAmount = (monthData, section, typePattern, field) => {
        if (!monthData || !monthData[section]) return 0;

        if (section === 'guarantees') {
            return monthData.guarantees?.[field] || 0;
        }

        const list = monthData[section]?.by_type || [];

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
    // Add logo from Cloudinary URL
    // ────────────────────────────────────────────────
    const addLogo = () => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Helps with CORS (Cloudinary usually allows it)

            img.src = LOGO_URL;

            img.onload = () => {
                const logoWidth = 45; // mm
                // Preserve aspect ratio
                const logoHeight = (img.height / img.width) * logoWidth;

                const pageWidth = doc.internal.pageSize.getWidth();
                const logoX = (pageWidth - logoWidth) / 2;

                try {
                    doc.addImage(img, "PNG", logoX, 8, logoWidth, logoHeight);
                } catch (e) {
                    console.warn("Could not add logo to PDF", e);
                }
                resolve();
            };

            img.onerror = () => {
                console.warn("Failed to load logo from Cloudinary – continuing without logo");
                resolve(); // continue anyway
            };
        });
    };

    // Load and add logo (wait for it)
    await addLogo();

    // ────────────────────────────────────────────────
    // Header text
    // ────────────────────────────────────────────────
    doc.setFontSize(20);
    // 297mm total / 2 = 148.5mm

    doc.setFontSize(10);
    doc.text(`Member's Name: ${member?.first_name || ""} ${member?.last_name || ""}`, 12, 42);
    doc.text(`Account No: ${member?.member_no || ""}`, 12, 48);
    // Align right side, roughly 297mm - 12mm = 285mm
    doc.text(`Employer: Tamarind Sacco Ltd`, 285, 42, { align: "right" });

    // ────────────────────────────────────────────────
    // Table header (two rows)
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
            { content: 'Balance', styles: { halign: 'right' } },
            { content: 'RECEIVED', styles: { halign: 'right' } },
            { content: 'W/DRAW', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            { content: 'LOANED', styles: { halign: 'right' } },
            { content: 'REPAID', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            { content: 'INTEREST', styles: { halign: 'right' } },
            { content: 'LOANED', styles: { halign: 'right' } },
            { content: 'REPAID', styles: { halign: 'right' } },
            { content: 'BALANCE', styles: { halign: 'right' } },
            { content: 'INTEREST', styles: { halign: 'right' } },
            { content: 'HOLIDAY', styles: { halign: 'right' } },
            { content: 'GUARANTEE', styles: { halign: 'right' } },
            { content: 'SODA', styles: { halign: 'right' } },
            { content: 'TOTAL', styles: { halign: 'right' } },
        ]
    ];

    // ────────────────────────────────────────────────
    // Table body
    // ────────────────────────────────────────────────
    const body = [];

    // Balance Brought Forward
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

    // ────────────────────────────────────────────────
    // Generate the table
    // ────────────────────────────────────────────────
    autoTable(doc, {
        startY: 55,
        head: head,
        body: body,
        theme: 'grid',
        styles: {
            fontSize: 6,
            cellPadding: 1,
            overflow: 'linebreak',
            lineWidth: 0.1,
            lineColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [210, 230, 210],
            textColor: 30,
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.1
        },
        columnStyles: {
            0: { cellWidth: 16 },   // DATE (16)
            1: { cellWidth: 16 },   // Shares (16)
            2: { cellWidth: 16 },   // Deposits (16 * 3 = 48)
            3: { cellWidth: 16 },
            4: { cellWidth: 16 },
            5: { cellWidth: 16 },   // Loans (16 * 4 = 64)
            6: { cellWidth: 16 },
            7: { cellWidth: 16 },
            8: { cellWidth: 16 },
            9: { cellWidth: 16 },   // Instant Loans (16 * 4 = 64)
            10: { cellWidth: 16 },
            11: { cellWidth: 16 },
            12: { cellWidth: 16 },
            13: { cellWidth: 16 },  // Other (16 * 3 = 48)
            14: { cellWidth: 16 },
            15: { cellWidth: 16 },
            16: { cellWidth: 20, halign: 'right', fontStyle: 'bold', textColor: [0, 80, 0] } // Total (20)
            // Total width: 16 + 16 + 48 + 64 + 64 + 48 + 20 = 276 mm. Fits within ~277mm (A4 landscape - margins).
        },
        didParseCell: (data) => {
            if (data.row.index === 0 && data.section === 'body') {
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [240, 245, 240];
            }
        },
        margin: { top: 55, left: 10, right: 10, bottom: 25 },
        tableWidth: 'wrap'
    });

    // ────────────────────────────────────────────────
    // Footer
    // ────────────────────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages();
    const today = new Date().toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(80);
        doc.text(
            `Page ${i} of ${pageCount}  •  Generated on ${today}`,
            148.5,
            202,
            { align: "center" }
        );
    }

    // Save
    doc.save(`${member?.member_no || 'Member'}_Statement_${currentYear}.pdf`);
};