import { Student } from '../types';

/**
 * Generates an official, high-resolution University Attendance Card as a PNG image
 * using HTML5 Canvas and triggers direct download in the user's browser.
 */
export function downloadStudentCardPNG(student: Student): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas context not available');
    return;
  }

  // 2x Retina resolution for razor sharp print and display
  const width = 1200;
  const height = 750;
  canvas.width = width;
  canvas.height = height;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Outer border with subtle corner radius styling
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Top College Header Banner
  const headerGradient = ctx.createLinearGradient(0, 0, width, 0);
  headerGradient.addColorStop(0, '#1e3a8a'); // Royal Navy Blue
  headerGradient.addColorStop(0.5, '#2563eb'); // Blue
  headerGradient.addColorStop(1, '#4338ca'); // Indigo
  ctx.fillStyle = headerGradient;
  ctx.fillRect(10, 10, width - 20, 140);

  // Gold accent line under header
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(10, 150, width - 20, 6);

  // College Logo / Crest Shield
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(80, 80, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Crest text inside circle
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PR', 80, 92);

  // Header Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('P. R. POTE PATIL COLLEGE OF ENGINEERING & MANAGEMENT', 150, 68);

  ctx.fillStyle = '#bfdbfe';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Autonomous Institute · Affiliated to University · Amravati, Maharashtra', 150, 98);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('ATTENDIFY OFFICIAL ACADEMIC TRANSCRIPT', width - 40, 128);

  // Left Column: Student Profile Details
  ctx.textAlign = 'left';
  
  // Student Avatar Box
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(100, 240, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 50px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(student.name.charAt(0), 100, 258);

  // Student Identity Info
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(student.name, 180, 225);

  ctx.fillStyle = '#2563eb';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`ROLL NO: ${student.rollNo}`, 180, 258);

  ctx.fillStyle = '#475569';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${student.department} · ${student.year} · ${student.college}`, 180, 288);

  // Overall Attendance Big Callout Box
  const isEligible = student.overallAttendance >= 75;
  const overallBoxX = width - 420;
  const overallBoxY = 180;
  const overallBoxW = 380;
  const overallBoxH = 120;

  ctx.fillStyle = isEligible ? '#f0fdf4' : '#fef2f2';
  ctx.fillRect(overallBoxX, overallBoxY, overallBoxW, overallBoxH);
  ctx.strokeStyle = isEligible ? '#86efac' : '#fca5a5';
  ctx.lineWidth = 2;
  ctx.strokeRect(overallBoxX, overallBoxY, overallBoxW, overallBoxH);

  ctx.fillStyle = isEligible ? '#166534' : '#991b1b';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OVERALL AGGREGATE ATTENDANCE', overallBoxX + 20, overallBoxY + 35);

  ctx.font = 'black 54px monospace';
  ctx.fillText(`${student.overallAttendance}%`, overallBoxX + 20, overallBoxY + 95);

  ctx.fillStyle = isEligible ? '#15803d' : '#b91c1c';
  ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(isEligible ? '✓ ELIGIBLE FOR EXAMS' : '⚠ SHORTAGE NOTICE', overallBoxX + overallBoxW - 20, overallBoxY + 80);
  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Min criteria: 75%', overallBoxX + overallBoxW - 20, overallBoxY + 102);

  // Table of Subjects
  const tableY = 340;
  const tableW = width - 80;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(40, tableY, tableW, 40);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(40, tableY, tableW, 40);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SUBJECT NAME', 60, tableY + 26);
  ctx.fillText('COURSE CODE', 360, tableY + 26);
  ctx.fillText('ATTENDED / TOTAL', 560, tableY + 26);
  ctx.fillText('PERCENTAGE', 820, tableY + 26);
  ctx.fillText('STATUS', 1020, tableY + 26);

  // Table Rows
  let currentY = tableY + 40;
  student.subjects.forEach((sub, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(40, currentY, tableW, 45);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(40, currentY, tableW, 45);

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(sub.name, 60, currentY + 28);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(sub.code, 360, currentY + 28);

    ctx.fillStyle = '#334155';
    ctx.font = '500 15px monospace';
    ctx.fillText(`${sub.attended} / ${sub.total} Classes`, 560, currentY + 28);

    const subEligible = sub.percentage >= 75;
    ctx.fillStyle = subEligible ? '#166534' : '#991b1b';
    ctx.font = 'bold 17px monospace';
    ctx.fillText(`${sub.percentage}%`, 820, currentY + 28);

    ctx.fillStyle = subEligible ? '#15803d' : '#b91c1c';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subEligible ? 'Satisfactory' : 'Needs Attention', 1020, currentY + 28);

    currentY += 45;
  });

  // Footer / Verification Section
  const footerY = 610;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, footerY);
  ctx.lineTo(width - 40, footerY);
  ctx.stroke();

  // Issue date & verification note
  const todayStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Issued on: ${todayStr} · Digitally certified by Attendify ERP System`, 40, footerY + 35);
  ctx.fillText('P. R. Pote Patil College of Engineering & Management, Amravati', 40, footerY + 60);

  // Signature Block
  ctx.textAlign = 'right';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dr. S. R. Deshmukh', width - 60, footerY + 45);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dean of Academics & Examinations', width - 60, footerY + 68);

  // Trigger browser download of generated PNG
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  const sanitizedName = student.name.replace(/\s+/g, '_');
  a.download = `${sanitizedName}_${student.rollNo}_Attendance_Card.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
