// 生成订单号：前8位年月日 + 5位随机数，共13位
function generateOrderNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    return `${year}${month}${day}${random}`;
}

// 门诊缴费数据
const payments = [
    {
        id: 1,
        orderNo: generateOrderNo(),
        hospital: '南方医科大学第三附属医院',
        department: '中医科门诊',
        doctor: '谢国平',
        patient: '人名',
        amount: '285.80 元'
    },
    {
        id: 2,
        orderNo: generateOrderNo(),
        hospital: '南方医科大学第三附属医院',
        department: '中医科门诊',
        doctor: '谢国平',
        patient: '人名',
        amount: '540.00 元'
    }
];

// 字段配置
const fieldConfig = [
    { key: 'hospital', label: '医院名称', type: 'text' },
    { key: 'department', label: '就诊科室', type: 'text' },
    { key: 'doctor', label: '开方医生', type: 'text' },
    { key: 'patient', label: '就诊人姓名', type: 'text' },
    { key: 'amount', label: '缴费金额', type: 'text', class: 'amount' }
];

// 渲染缴费列表
function renderPayments() {
    const listEl = document.getElementById('paymentList');
    if (!listEl) return;

    listEl.innerHTML = payments.map(item => `
        <div class="payment-card" data-id="${item.id}">
            <div class="card-header">
                <div class="order-no">
                    <span class="label">订单号：</span>
                    <span class="value editable-text" data-id="${item.id}" data-field="orderNo">${item.orderNo}</span>
                </div>
            </div>
            <div class="info-list">
                ${fieldConfig.map(field => `
                    <div class="info-row">
                        <div class="info-label">${field.label}</div>
                        <div class="info-value ${field.class || ''}" 
                             data-id="${item.id}" 
                             data-field="${field.key}">
                            ${item[field.key]}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer card-footer-right">
                <a href="payment-detail.html" class="btn btn-outline">查看明细</a>
            </div>
        </div>
    `).join('');

    bindEditEvents();
    bindEditableTextEvents();
}

// 绑定信息行点击编辑事件
function bindEditEvents() {
    const valueEls = document.querySelectorAll('.info-value');
    valueEls.forEach(el => {
        el.addEventListener('click', handleValueClick);
    });
}

// 绑定可编辑文本事件（订单号、用户名等）
function bindEditableTextEvents() {
    const editableEls = document.querySelectorAll('.editable-text');
    editableEls.forEach(el => {
        el.addEventListener('click', handleEditableClick);
    });
}

// 点击信息值进入编辑状态
function handleValueClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const id = parseInt(el.dataset.id);
    const field = el.dataset.field;
    const currentValue = el.textContent.trim();
    const isAmount = el.classList.contains('amount');
    const alignLeft = el.classList.contains('align-left');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        const payment = payments.find(p => p.id === id);
        if (payment && newValue !== '') {
            payment[field] = newValue;
        }
        el.textContent = payment[field];
    };

    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
        if (e.key === 'Escape') {
            input.value = currentValue;
            input.blur();
        }
    });

    e.stopPropagation();
}

// 点击可编辑文本进入编辑状态
function handleEditableClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const currentValue = el.textContent.trim();
    const id = el.dataset.id ? parseInt(el.dataset.id) : null;
    const field = el.dataset.field;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.style.cssText = `
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        border: 1px solid #26c2a0;
        border-radius: 4px;
        padding: 2px 8px;
        outline: none;
        background: #fff;
        font-family: inherit;
        width: ${Math.max(currentValue.length * 1.2, 6)}em;
    `;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue === '') {
            el.textContent = currentValue;
            return;
        }

        if (id && field) {
            const payment = payments.find(p => p.id === id);
            if (payment) {
                payment[field] = newValue;
            }
        }

        el.textContent = newValue;
    };

    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
        if (e.key === 'Escape') {
            el.textContent = currentValue;
        }
    });

    e.stopPropagation();
}

// 页面加载完成后渲染
document.addEventListener('DOMContentLoaded', renderPayments);
