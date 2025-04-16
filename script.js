// 獲取所有輸入元素
const startYear = document.getElementById('startYear');
const startMonth = document.getElementById('startMonth');
const startDay = document.getElementById('startDay');
const startHour = document.getElementById('startHour');
const startMinute = document.getElementById('startMinute');
const endYear = document.getElementById('endYear');
const endMonth = document.getElementById('endMonth');
const endDay = document.getElementById('endDay');
const endHour = document.getElementById('endHour');
const endMinute = document.getElementById('endMinute');
const totalPriceElement = document.getElementById('totalPrice');
const durationElement = document.getElementById('duration');
const timeSlotElement = document.getElementById('timeSlot');
const isHolidayElement = document.getElementById('isHoliday');

// 檢查所有必需的元素是否存在
function checkRequiredElements() {
    const requiredElements = [
        startYear, startMonth, startDay, startHour, startMinute,
        endYear, endMonth, endDay, endHour, endMinute,
        totalPriceElement, durationElement, timeSlotElement, isHolidayElement
    ];
    
    for (const element of requiredElements) {
        if (!element) {
            console.error('找不到必要的元素:', element);
            return false;
        }
    }
    return true;
}

// 價格表
const priceTable = {
    weekday: {
        day: { // 8-16
            3: 360,
            5: 460
        },
        evening: { // 16-24
            3: 420,
            5: 600
        },
        night: { // 0-8
            8: 640
        }
    },
    holiday: {
        day: { // 8-16
            3: 390,
            5: 490
        },
        evening: { // 16-24
            3: 450,
            5: 620
        },
        night: { // 0-8
            8: 680
        }
    }
};

// 假日列表
const holidays = {
    '2024': {
        '1': {
            '1': '元旦',
            '2': '元旦補假'
        },
        '2': {
            '8': '小年夜',
            '9': '除夕',
            '10': '春節',
            '11': '春節',
            '12': '春節',
            '13': '春節',
            '14': '春節',
            '28': '228紀念日'
        },
        '3': {
            '1': '228紀念日補假'
        },
        '4': {
            '4': '兒童節',
            '5': '清明節'
        },
        '5': {
            '1': '勞動節'
        },
        '6': {
            '10': '端午節'
        },
        '9': {
            '17': '中秋節'
        },
        '10': {
            '10': '國慶日',
            '11': '國慶日補假'
        },
        '12': {
            '25': '行憲紀念日'
        }
    },
    '2025': {
        '1': {
            '1': '元旦'
        },
        '2': {
            '28': '228紀念日'
        },
        '4': {
            '4': '兒童節',
            '5': '清明節'
        },
        '5': {
            '1': '勞動節'
        },
        '6': {
            '10': '端午節'
        },
        '9': {
            '17': '中秋節'
        },
        '10': {
            '10': '國慶日'
        },
        '12': {
            '25': '行憲紀念日'
        }
    }
};

// 設置時間選擇器的選項
function setupTimeSelectors() {
    if (!checkRequiredElements()) {
        console.error('無法初始化時間選擇器：缺少必要的元素');
        return;
    }

const now = new Date();
    const currentYear = now.getFullYear();
    
    // 設置年份選項（當前年份到後一年）
    for (let year = currentYear; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        startYear.appendChild(option.cloneNode(true));
        endYear.appendChild(option.cloneNode(true));
    }
    
    // 設置月份選項
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        startMonth.appendChild(option.cloneNode(true));
        endMonth.appendChild(option.cloneNode(true));
    }
    
    // 設置日期選項
    updateDayOptions();
    
    // 設置小時選項
    for (let hour = 0; hour < 24; hour++) {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour + '時';
        startHour.appendChild(option.cloneNode(true));
        endHour.appendChild(option.cloneNode(true));
    }
    
    // 設置分鐘選項
    for (let minute = 0; minute < 60; minute += 30) {
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute + '分';
        startMinute.appendChild(option.cloneNode(true));
        endMinute.appendChild(option.cloneNode(true));
    }
}

// 更新日期選項
function updateDayOptions() {
    if (!startYear || !startMonth || !startDay || !endDay) {
        console.error('無法更新日期選項：缺少必要的元素');
        return;
    }

    const year = parseInt(startYear.value);
    const month = parseInt(startMonth.value);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 清空現有選項
    startDay.innerHTML = '';
    endDay.innerHTML = '';
    
    // 添加新的日期選項
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day + '日';
        startDay.appendChild(option.cloneNode(true));
        endDay.appendChild(option.cloneNode(true));
    }
}

// 添加事件監聽器
if (startYear && startMonth && endYear && endMonth) {
    startYear.addEventListener('change', updateDayOptions);
    startMonth.addEventListener('change', updateDayOptions);
    endYear.addEventListener('change', updateDayOptions);
    endMonth.addEventListener('change', updateDayOptions);
}

// 判斷是否為假日（周六日）
function isHoliday(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

// 獲取時間段類型
function getTimeSlot(hours) {
    if (hours >= 8 && hours < 16) return 'day';
    if (hours >= 16 && hours < 24) return 'evening';
    return 'night';
}

// 獲取時間段描述
function getTimeSlotDescription(slot) {
    switch (slot) {
        case 'day': return '白天 (8-16時)';
        case 'evening': return '中班 (16-24時)';
        case 'night': return '大夜 (0-8時)';
        default: return '-';
    }
}

// 計算價格的函數
function calculatePrice() {
    try {
        // 獲取輸入值
        const startYear = parseInt(document.getElementById('startYear').value);
        const startMonth = parseInt(document.getElementById('startMonth').value);
        const startDay = parseInt(document.getElementById('startDay').value);
        const startHour = parseInt(document.getElementById('startHour').value);
        const startMinute = parseInt(document.getElementById('startMinute').value);
        const endYear = parseInt(document.getElementById('endYear').value);
        const endMonth = parseInt(document.getElementById('endMonth').value);
        const endDay = parseInt(document.getElementById('endDay').value);
        const endHour = parseInt(document.getElementById('endHour').value);
        const endMinute = parseInt(document.getElementById('endMinute').value);
        const adultCount = parseInt(document.getElementById('adultCount').value);
        const childCount = parseInt(document.getElementById('childCount').value);

        // 檢查必要輸入
        if (!startYear || !startMonth || !startDay || !startHour || !startMinute ||
            !endYear || !endMonth || !endDay || !endHour || !endMinute) {
            throw new Error('請填寫完整的預約時間');
        }

        if (!adultCount || adultCount < 3) {
            throw new Error('成人人數至少需要3人');
        }

        // 計算有效人數（兒童算0.8人）
        const effectivePeopleCount = parseFloat((adultCount + (childCount * 0.8)).toFixed(1));

        // 計算使用時數
        const startDateTime = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
        const endDateTime = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);
        const hoursDiff = (endDateTime - startDateTime) / (1000 * 60 * 60);
        let hours = Math.floor(hoursDiff);
        const minutes = Math.round((hoursDiff - hours) * 60);
        
        if (minutes !== 0 && minutes !== 30) {
            throw new Error('預約時長必須為整數小時或半小時');
        }

        if (hours < 3) {
            throw new Error('總預約時間不能小於3小時');
        }

        // 判斷是否為假日
        const isWeekend = isHoliday(startDateTime);

        // 判斷時段類型
        let timeSlot = '';
        let pricePerPerson = 0;
        let formula = '';

        if (hours === 24 && startHour === endHour && startMinute === endMinute) {
            // 24小時預約
            timeSlot = isWeekend ? '假日24小時' : '平日24小時';
            pricePerPerson = isWeekend ? 2000 : 1850;
            formula = `${effectivePeopleCount}*(${isWeekend ? 2000 : 1850})`;
        } else if (startHour >= 16 && (endHour <= 0 || (endHour === 0 && endMinute <= 30))) {
            // 中班時段
            timeSlot = isWeekend ? '假日中班' : '平日中班';
            if (hours <= 3) {
                pricePerPerson = (isWeekend ? 450 : 420) * (hours / 3);
                formula = hours === 3 ? `${effectivePeopleCount}*(${isWeekend ? 450 : 420})` : `${effectivePeopleCount}*(${isWeekend ? 450 : 420}/3*${hours})`;
                timeSlot += `${hours}小時`;
            } else if (hours === 4) {
                pricePerPerson = (isWeekend ? 450 : 420) + 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 450 : 420}+80)`;
                timeSlot += '3小時+1小時加時';
            } else if (hours === 5) {
                pricePerPerson = isWeekend ? 620 : 600;
                formula = `${effectivePeopleCount}*(${isWeekend ? 620 : 600})`;
                timeSlot += '5小時';
            } else {
                const overtimeHours = hours - 5;
                pricePerPerson = (isWeekend ? 620 : 600) + overtimeHours * 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 620 : 600}+${overtimeHours === 1 ? '80' : overtimeHours + '*80'})`;
                timeSlot += `5小時+${overtimeHours}小時加時`;
            }
        } else if (startHour >= 8 && startHour < 16 && (endHour >= 16 || endHour < 8)) {
            // 跨時段的情況
            const dayHours = 16 - startHour;
            const nightHours = endHour < 8 ? endHour + 24 - 16 : endHour - 16;

            let dayPrice = 0;
            let dayFormula = '';
            let daySlot = isWeekend ? '假日白天' : '平日白天';
            if (dayHours <= 3) {
                dayPrice = (isWeekend ? 390 : 360) * (dayHours / 3);
                dayFormula = dayHours === 3 ? `(${isWeekend ? 390 : 360})` : `(${isWeekend ? 390 : 360}/3*${dayHours})`;
                daySlot += `${dayHours}小時`;
            } else if (dayHours === 4) {
                dayPrice = (isWeekend ? 390 : 360) + 80;
                dayFormula = `(${isWeekend ? 390 : 360}+80)`;
                daySlot += '3小時+1小時加時';
            } else if (dayHours === 5) {
                dayPrice = isWeekend ? 490 : 460;
                dayFormula = `(${isWeekend ? 490 : 460})`;
                daySlot += '5小時';
            } else {
                const overtimeHours = dayHours - 5;
                dayPrice = (isWeekend ? 490 : 460) + overtimeHours * 80;
                dayFormula = `(${isWeekend ? 490 : 460}+${overtimeHours === 1 ? '80' : overtimeHours + '*80'})`;
                daySlot += `5小時+${overtimeHours}小時加時`;
            }

            let nightPrice = 0;
            let nightFormula = '';
            let nightSlot = isWeekend ? '假日中班' : '平日中班';
            if (nightHours < 3) {
                nightPrice = (isWeekend ? 450 : 420) * (nightHours / 3);
                nightFormula = nightHours === 3 ? `(${isWeekend ? 450 : 420})` : `(${isWeekend ? 450 : 420}/3*${nightHours})`;
                nightSlot += `${nightHours}小時`;
            } else if (nightHours === 3) {
                nightPrice = isWeekend ? 450 : 420;
                nightFormula = `(${isWeekend ? 450 : 420})`;
                nightSlot += '3小時';
            } else if (nightHours === 4) {
                nightPrice = (isWeekend ? 450 : 420) + 80;
                nightFormula = `(${isWeekend ? 450 : 420}+80)`;
                nightSlot += '3小時+1小時加時';
            } else if (nightHours === 5) {
                nightPrice = isWeekend ? 620 : 600;
                nightFormula = `(${isWeekend ? 620 : 600})`;
                nightSlot += '5小時';
            } else {
                const overtimeHours = nightHours - 5;
                nightPrice = (isWeekend ? 620 : 600) + overtimeHours * 80;
                nightFormula = `(${isWeekend ? 620 : 600}+${overtimeHours === 1 ? '80' : overtimeHours + '*80'})`;
                nightSlot += `5小時+${overtimeHours}小時加時`;
            }

            pricePerPerson = dayPrice + nightPrice;
            formula = `${effectivePeopleCount}*(${dayFormula}+${nightFormula})`;
            timeSlot = `${daySlot}+${nightSlot}`;
        } else if (startHour >= 8 && endHour <= 16) {
            // 純白天時段
            timeSlot = isWeekend ? '假日白天' : '平日白天';
            if (hours <= 3) {
                pricePerPerson = (isWeekend ? 390 : 360) * (hours / 3);
                formula = hours === 3 ? `${effectivePeopleCount}*(${isWeekend ? 390 : 360})` : `${effectivePeopleCount}*(${isWeekend ? 390 : 360}/3*${hours})`;
                timeSlot += '3小時';
            } else if (hours === 4) {
                pricePerPerson = (isWeekend ? 390 : 360) + 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 390 : 360}+80)`;
                timeSlot += '3小時+1小時加時';
            } else if (hours === 5) {
                pricePerPerson = isWeekend ? 490 : 460;
                formula = `${effectivePeopleCount}*(${isWeekend ? 490 : 460})`;
                timeSlot += '5小時';
            } else {
                const overtimeHours = hours - 5;
                pricePerPerson = (isWeekend ? 490 : 460) + overtimeHours * 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 490 : 460}+${overtimeHours === 1 ? '80' : overtimeHours + '*80'})`;
                timeSlot += `5小時+${overtimeHours}小時加時`;
            }
        } else if (startHour >= 16 && endHour <= 24) {
            // 純中班時段
            timeSlot = isWeekend ? '假日中班' : '平日中班';
            if (hours <= 3) {
                pricePerPerson = (isWeekend ? 450 : 420) * (hours / 3);
                formula = hours === 3 ? `${effectivePeopleCount}*(${isWeekend ? 450 : 420})` : `${effectivePeopleCount}*(${isWeekend ? 450 : 420}/3*${hours})`;
                timeSlot += `${hours}小時`;
            } else if (hours === 4) {
                pricePerPerson = (isWeekend ? 450 : 420) + 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 450 : 420}+80)`;
                timeSlot += '3小時+1小時加時';
            } else if (hours === 5) {
                pricePerPerson = isWeekend ? 620 : 600;
                formula = `${effectivePeopleCount}*(${isWeekend ? 620 : 600})`;
                timeSlot += '5小時';
            } else {
                const overtimeHours = hours - 5;
                pricePerPerson = (isWeekend ? 620 : 600) + overtimeHours * 80;
                formula = `${effectivePeopleCount}*(${isWeekend ? 620 : 600}+${overtimeHours === 1 ? '80' : overtimeHours + '*80'})`;
                timeSlot += `5小時+${overtimeHours}小時加時`;
            }
        } else if (startHour >= 0 && endHour <= 8) {
            // 大夜時段
            if (startHour !== 0 || endHour !== 8) {
                throw new Error('我們大夜時段要預約一整段8小時喔，00:00~08:00，或是00:30~08:30，謝謝');
            }
            timeSlot = isWeekend ? '假日大夜8小時' : '平日大夜8小時';
            pricePerPerson = isWeekend ? 680 : 640;
            formula = `${effectivePeopleCount}*(${isWeekend ? 680 : 640})`;
        }

        // 計算總金額
        const totalPrice = Math.round(pricePerPerson * effectivePeopleCount);
        const deposit = 500; // 固定定金
        const finalPayment = totalPrice - deposit;

        // 更新顯示
        document.getElementById('totalPrice').textContent = totalPrice;
        document.getElementById('deposit').textContent = deposit;
        document.getElementById('finalPayment').textContent = finalPayment;
        document.getElementById('duration').textContent = `${hours}小時${minutes ? ` ${minutes}分` : ''}`;
        document.getElementById('timeSlot').textContent = timeSlot;
        document.getElementById('isHoliday').textContent = isWeekend ? '是' : '否';
        document.getElementById('formula').textContent = formula;

        return {
            totalPrice,
            deposit,
            finalPayment,
            timeSlot,
            isWeekend,
            hours,
            minutes,
            formula
        };
    } catch (error) {
        console.error('計算價格時發生錯誤:', error);
        alert(error.message);
        return null;
    }
}

// 計算退款的函數
function calculateRefund() {
    try {
        const totalAdmission = parseFloat(document.getElementById('totalPrice').textContent);
        const deposit = parseFloat(document.getElementById('deposit').textContent);
        const childCount = parseInt(document.getElementById('childCount').value);
        const discountRate = 0.8; // 兒童折扣率

        if (!totalAdmission || !deposit) {
            throw new Error('請先計算入場費');
        }

        // 計算兒童折扣金額
        const childDiscount = childCount * (totalAdmission / (parseInt(document.getElementById('adultCount').value) + childCount * discountRate)) * (1 - discountRate);
        
        // 計算退款金額
        const refundAmount = deposit - childDiscount;
        
        // 更新顯示
        document.getElementById('refundAmount').textContent = refundAmount.toFixed(0);
        document.getElementById('childDiscount').textContent = childDiscount.toFixed(0);

        return {
            refundAmount,
            childDiscount
        };
    } catch (error) {
        console.error('計算退款時發生錯誤:', error);
        alert(error.message);
        return null;
    }
}

// 初始化
if (checkRequiredElements()) {
    setupTimeSelectors();
    calculatePrice();
} else {
    console.error('無法初始化：缺少必要的元素');
}

// 初始化假日列表
function initializeHolidays() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // 確保當前年份和下一年的假日列表存在
    if (!holidays[currentYear]) {
        holidays[currentYear] = {};
    }
    if (!holidays[nextYear]) {
        holidays[nextYear] = {};
    }
}

// 在頁面載入時初始化假日列表
window.onload = function() {
    initializeHolidays();
    // 獲取當前日期
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const roundedMinute = currentMinute >= 30 ? 30 : 0;

    // 初始化時間選單
    function initializeTimeSelects() {
        // 年份選單
        ['startYear', 'endYear'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">選擇年份</option>';
            const currentYear = new Date().getFullYear();
            select.add(new Option(currentYear + '年', currentYear));
            select.add(new Option((currentYear + 1) + '年', currentYear + 1));
            select.value = currentYear;
        });

        // 月份選單
        ['startMonth', 'endMonth'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">選擇月份</option>';
            for (let i = 1; i <= 12; i++) {
                select.add(new Option(i + '月', i));
            }
            select.value = currentMonth;
        });

        // 日期選單
        ['startDay', 'endDay'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">選擇日期</option>';
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                select.add(new Option(i + '日', i));
            }
            select.value = currentDay;
        });

        // 小時選單
        ['startHour', 'endHour'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">選擇時</option>';
            for (let i = 0; i <= 23; i++) {
                select.add(new Option(i + '時', i));
            }
            select.value = currentHour;
        });

        // 分鐘選單
        ['startMinute', 'endMinute'].forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">選擇分</option>';
            select.add(new Option('0分', '0'));
            select.add(new Option('30分', '30'));
            select.value = '0';
        });
    }

    // 初始化所有選單
    initializeTimeSelects();

    // 綁定事件監聽器
    ['start', 'end'].forEach(prefix => {
        document.getElementById(prefix + 'Year').addEventListener('change', () => updateDays(prefix));
        document.getElementById(prefix + 'Month').addEventListener('change', () => updateDays(prefix));
    });

    // 初始化日期選單
    updateDays('start');
    updateDays('end');

    // 人數選單
    const peopleSelect = document.getElementById('peopleCount');
    peopleSelect.innerHTML = '<option value="">請選擇人數</option>';
    for (let i = 3; i <= 18; i++) {
        peopleSelect.add(new Option(i + '人', i));
    }
    peopleSelect.value = '';

    // 移除手動輸入人數的事件監聽
    const manualPeopleCount = document.getElementById('childCount');
    manualPeopleCount.addEventListener('change', function() {
        const value = parseFloat(this.value);
        if (value >= 0 && value <= 18) {
            // 移除清空成人選單的邏輯
        }
    });

    peopleSelect.addEventListener('change', function() {
        // 移除清空孩童選單的邏輯
    });
}

// 更新日期選單的函數
function updateDays(prefix) {
    const year = document.getElementById(prefix + 'Year').value;
    const month = document.getElementById(prefix + 'Month').value;
    const daySelect = document.getElementById(prefix + 'Day');
    const currentValue = daySelect.value;
    
    daySelect.innerHTML = '<option value="">選擇日期</option>';
    
    if (year && month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const option = new Option(i + '日', i);
            daySelect.add(option);
        }
        
        if (currentValue && currentValue <= daysInMonth) {
            daySelect.value = currentValue;
        }
    }
}

// 判斷是否為假日的函數
function isHoliday(year, month, day) {
    // 先檢查是否為週末
    const date = new Date(year, month - 1, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // 再檢查是否為國定假日
    const yearHolidays = holidays[year.toString()];
    if (yearHolidays) {
        const monthHolidays = yearHolidays[month.toString()];
        if (monthHolidays && monthHolidays[day.toString()]) {
            return true;
        }
    }
    
    return isWeekend;
}

// 確認登記定金的函數
async function confirmDeposit() {
    const startYear = document.getElementById('startYear').value;
    const startMonth = document.getElementById('startMonth').value.padStart(2, '0');
    const startDay = document.getElementById('startDay').value.padStart(2, '0');
    const customerName = document.getElementById('customerName').value;
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const childCount = parseInt(document.getElementById('childCount').value);
    const timeSlot = document.getElementById('timeSlot').textContent;
    const totalDeposit = parseFloat(document.getElementById('deposit').textContent.replace(/,/g, '')) + 
                        parseFloat(document.getElementById('childDeposit').textContent.replace(/,/g, ''));
    const totalAmount = parseFloat(document.getElementById('totalAdmission').textContent.replace(/,/g, ''));

    try {
        await recordDeposit({
            date: `${startYear}/${startMonth}/${startDay}`,
            name: customerName,
            phone: '', // 如果需要電話，可以從表單獲取
            totalDeposit: totalDeposit,
            timeSlot: timeSlot,
            adults: peopleCount,
            children: childCount,
            totalAmount: totalAmount,
            balance: 0 // 初始結餘為0
        });
        alert('定金記錄已成功保存');
    } catch (error) {
        console.error('記錄定金失敗:', error);
        alert('記錄定金失敗，請重試');
    }
}

// 確認登記尾款的函數
async function confirmFinalPayment() {
    const startYear = document.getElementById('startYear').value;
    const startMonth = document.getElementById('startMonth').value.padStart(2, '0');
    const startDay = document.getElementById('startDay').value.padStart(2, '0');
    const customerName = document.getElementById('customerName').value;
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const childCount = parseInt(document.getElementById('childCount').value);
    const timeSlot = document.getElementById('timeSlot').textContent;
    const totalAmount = parseFloat(document.getElementById('totalAdmission').textContent.replace(/,/g, ''));
    const totalDeposit = parseFloat(document.getElementById('deposit').textContent.replace(/,/g, '')) + 
                        parseFloat(document.getElementById('childDeposit').textContent.replace(/,/g, ''));

    try {
        await recordReservation({
            date: `${startYear}/${startMonth}/${startDay}`,
            name: customerName,
            phone: '', // 如果需要電話，可以從表單獲取
            timeSlot: timeSlot,
            adults: peopleCount,
            children: childCount,
            totalAmount: totalAmount,
            totalDeposit: totalDeposit,
            balance: 0 // 初始結餘為0
        });
        alert('尾款記錄已成功保存');
    } catch (error) {
        console.error('記錄尾款失敗:', error);
        alert('記錄尾款失敗，請重試');
    }
}

// 確認登記退款的函數
async function confirmRefund() {
    const startYear = document.getElementById('startYear').value;
    const startMonth = document.getElementById('startMonth').value.padStart(2, '0');
    const startDay = document.getElementById('startDay').value.padStart(2, '0');
    const customerName = document.getElementById('customerName').value;
    const refundAmount = parseFloat(document.getElementById('refundAmount').textContent.replace(/,/g, ''));
    const reason = document.getElementById('refundReason').value;

    try {
        await recordRefund({
            date: `${startYear}/${startMonth}/${startDay}`,
            name: customerName,
            phone: '', // 如果需要電話，可以從表單獲取
            refundAmount: refundAmount,
            reason: reason,
            balance: 0 // 初始結餘為0
        });
        alert('退款記錄已成功保存');
    } catch (error) {
        console.error('記錄退款失敗:', error);
        alert('記錄退款失敗，請重試');
    }
} 