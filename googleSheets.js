// Google Sheets API 配置
const SPREADSHEET_ID = '1bmXl1dnkSxD0Tynsn8Sm1DnJoosngvFysEkBjXjTTpM'; // 試算表 ID
const SHEET_NAME = '工作表1'; // 試算表的工作表名稱
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwf3Fs1dAp_amPmxUR351d_iOHy6t-2_FFDYC9WPXxP9p5iFjYzcNWtBTcpPS9KaHXZFA/exec';

// 發送數據到 Google Sheets
async function sendToGoogleSheets(data) {
    try {
        console.log('開始發送數據到 Google Sheets:', data);
        
        // 準備發送的數據
        const requestData = {
            action: data.action,
            date: data.date,
            name: data.name,
            expenseAmount: data.expenseAmount || 0,
            expenseItem: data.expenseItem || '',
            incomeAmount: data.incomeAmount || 0,
            incomeItem: data.incomeItem || '',
            balance: data.balance || 0,
            discountedAmount: data.discountedAmount || 0
        };
        console.log('準備發送的數據:', requestData);

        // 使用 fetch API 發送請求
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        console.log('請求已發送，等待回應...');
        return { success: true };
    } catch (error) {
        console.error('發送數據失敗:', error);
        throw error;
    }
}

// 記錄定金
async function recordDeposit(data) {
    try {
        console.log('開始記錄定金:', data);
        const customerName = data.name || document.getElementById('customerName').value;
        if (!customerName) {
            throw new Error('請輸入姓名');
        }
        
        const depositData = {
            action: 'addDeposit',
            date: data.date, // 格式為 YYYY/MM/DD
            name: customerName, // 確保有姓名
            expenseAmount: '', // 支出金額留白
            expenseItem: '', // 支出項目留白
            incomeAmount: 500, // 固定定金金額
            incomeItem: customerName + '定金', // 收入項目為"姓名定金"
            balance: 0, // 結餘會在 Google Apps Script 中計算
            discountedAmount: '' // 折後金額留白
        };

        const result = await sendToGoogleSheets(depositData);
        console.log('定金記錄成功:', result);
        return result;
    } catch (error) {
        console.error('記錄定金失敗:', error);
        throw error;
    }
}

// 記錄尾款
async function recordFinalPayment(data) {
    try {
        console.log('開始記錄尾款:', data);
        const customerName = data.name || document.getElementById('customerName').value;
        if (!customerName) {
            throw new Error('請輸入姓名');
        }

        // 獲取總入場費和押金尾款
        const totalAdmission = parseFloat(document.getElementById('totalAdmission').textContent.replace(/,/g, ''));
        const deposit = parseFloat(document.getElementById('deposit').textContent.replace(/,/g, ''));
        const childDeposit = parseFloat(document.getElementById('childDeposit').textContent.replace(/,/g, ''));
        const finalPayment = totalAdmission + deposit + childDeposit - 500; // 總入場費 + 押金尾款

        const finalPaymentData = {
            action: 'addFinalPayment',
            date: data.date, // 格式為 YYYY/MM/DD
            name: customerName, // 姓名
            expenseAmount: '', // 支出金額留白
            expenseItem: '', // 支出項目留白
            incomeAmount: finalPayment, // 收入金額（總入場費 + 押金尾款）
            incomeItem: customerName + '尾款', // 收入項目為"姓名尾款"
            balance: 0, // 結餘會在 Google Apps Script 中計算
            discountedAmount: '' // 折後金額留白
        };

        const result = await sendToGoogleSheets(finalPaymentData);
        console.log('尾款記錄成功:', result);
        return result;
    } catch (error) {
        console.error('記錄尾款失敗:', error);
        throw error;
    }
}

// 記錄退款
async function recordRefund(data) {
    try {
        console.log('開始記錄退款:', data);
        const customerName = data.name || document.getElementById('customerName').value;
        if (!customerName) {
            throw new Error('請輸入姓名');
        }

        // 獲取折後金額
        const discountedAmount = parseFloat(document.getElementById('discountedAmount').textContent.replace(/,/g, ''));

        const refundData = {
            action: 'addRefund',
            date: data.date, // 格式為 YYYY/MM/DD
            name: customerName,
            expenseAmount: data.refundAmount, // 退款金額
            expenseItem: customerName + '退款', // 支出項目為"姓名退款"
            incomeAmount: '', // 收入金額留白
            incomeItem: '', // 收入項目留白
            balance: 0, // 結餘會在 Google Apps Script 中計算
            discountedAmount: discountedAmount // 折後金額
        };

        const result = await sendToGoogleSheets(refundData);
        console.log('退款記錄成功:', result);
        return result;
    } catch (error) {
        console.error('記錄退款失敗:', error);
        throw error;
    }
}

// 導出函數
window.recordDeposit = recordDeposit;
window.recordFinalPayment = recordFinalPayment;
window.recordRefund = recordRefund;

