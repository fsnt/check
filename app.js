// 预约数据
const appointments = [
    {
        id: 1,
        orderNo: '2026082503768',
        status: '预约成功(已缴费)',
        patient: '余志浩',
        doctor: '赵羽',
        department: '血液内科',
        price: '39.00 元',
        time: '2026-08-26 08:00-08:30',
        seqNo: '8',
        location: '门诊大楼4楼-内科候诊区30号诊室'
    },
    {
        id: 2,
        orderNo: '2026041805453',
        status: '预约成功(已缴费)',
        patient: '余志浩',
        doctor: '古瑞宾',
        department: '中医骨伤科',
        price: '25.00 元',
        time: '2026-04-19 09:00-09:30',
        seqNo: '12',
        location: '门诊大楼3楼-中医候诊区15号诊室'
    }
];

// 字段配置
const fieldConfig = [
    { key: 'patient', label: '就诊人', type: 'text' },
    { key: 'doctor', label: '医生姓名', type: 'text' },
    { key: 'department', label: '就诊科室', type: 'text' },
    { key: 'price', label: '诊金费用', type: 'text', class: 'price' },
    { key: 'time', label: '预约时间', type: 'text' },
    { key: 'seqNo', label: '就诊序号', type: 'text', class: 'seq-no' },
    { key: 'location', label: '就诊位置', type: 'text', class: 'location' }
];

// 渲染预约列表
function renderAppointments() {
    const listEl = document.getElementById('appointmentList');
    if (!listEl) return;

    listEl.innerHTML = appointments.map(item => `
        <div class="appointment-card" data-id="${item.id}">
            <div class="card-header">
                <div class="order-no">
                    <span class="label">订单号：</span>
                    <span class="value editable-text" data-id="${item.id}" data-field="orderNo">${item.orderNo}</span>
                </div>
                <span class="status-tag">${item.status}</span>
            </div>
            <div class="info-list">
                ${fieldConfig.map(field => `
                    <div class="info-row">
                        <div class="info-label">${field.label}</div>
                        <div class="info-value ${field.class || ''}" 
                             data-id="${item.id}" 
                             data-field="${field.key}"
                             contenteditable="false">
                            ${item[field.key]}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    bindEditEvents();
    bindEditableTextEvents();
}

// 绑定点击编辑事件
function bindEditEvents() {
    const valueEls = document.querySelectorAll('.info-value');
    valueEls.forEach(el => {
        el.addEventListener('click', handleValueClick);
    });
}

// 绑定可编辑文本事件（用户名、订单号等）
function bindEditableTextEvents() {
    const editableEls = document.querySelectorAll('.editable-text');
    editableEls.forEach(el => {
        el.addEventListener('click', handleEditableClick);
    });
}

// 点击可编辑文本进入编辑状态
function handleEditableClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const currentValue = el.textContent.trim();
    const id = el.dataset.id ? parseInt(el.dataset.id) : null;
    const field = el.dataset.field;

    // 创建输入框
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

    // 清空原内容并放入输入框
    const originalHTML = el.innerHTML;
    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    // 保存函数
    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue === '') {
            el.textContent = currentValue;
            return;
        }

        if (id && field) {
            // 订单号：更新数据
            const appointment = appointments.find(a => a.id === id);
            if (appointment) {
                appointment[field] = newValue;
            }
        }

        el.textContent = newValue;
    };

    // 失焦保存
    input.addEventListener('blur', saveValue);

    // 回车保存
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

// 点击值进入编辑状态
function handleValueClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return; // 已经在编辑中

    const id = parseInt(el.dataset.id);
    const field = el.dataset.field;
    const currentValue = el.textContent.trim();
    const isPrice = el.classList.contains('price');
    const isSeqNo = el.classList.contains('seq-no');
    const isLocation = el.classList.contains('location');

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;

    // 清空原内容并放入输入框
    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    // 保存函数
    const saveValue = () => {
        const newValue = input.value.trim();
        const appointment = appointments.find(a => a.id === id);
        if (appointment && newValue !== '') {
            appointment[field] = newValue;
        }
        // 重新渲染该值
        el.textContent = appointment[field];
    };

    // 失焦保存
    input.addEventListener('blur', saveValue);

    // 回车保存
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
        if (e.key === 'Escape') {
            input.value = currentValue;
            input.blur();
        }
    });

    // 阻止事件冒泡
    e.stopPropagation();
}

// 页面加载完成后渲染
document.addEventListener('DOMContentLoaded', renderAppointments);
