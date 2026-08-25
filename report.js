// 获取当前时间，格式化为 YYYY-MM-DD HH:mm:ss
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 门诊报告数据
const reports = [
    {
        id: 1,
        reportNo: '33609709',
        status: '已出报告，已审核',
        projectName: 'T淋巴细胞亚群检测',
        applyDept: '感染科门诊',
        applyDoctor: '黄莹',
        applyTime: getCurrentDateTime(),
        reportDept: '临检室',
        reportTime: getCurrentDateTime(),
        patient: '人名'
    },
    {
        id: 2,
        reportNo: '33616735',
        status: '已出报告，已审核',
        projectName: '免疫六项',
        applyDept: '感染科门诊',
        applyDoctor: '黄莹',
        applyTime: getCurrentDateTime(),
        reportDept: '临检室',
        reportTime: getCurrentDateTime(),
        patient: '人名'
    }
];

// 字段配置
const fieldConfig = [
    { key: 'projectName', label: '项目名称', type: 'text' },
    { key: 'applyDept', label: '申请科室', type: 'text' },
    { key: 'applyDoctor', label: '申请医生', type: 'text' },
    { key: 'applyTime', label: '申请时间', type: 'text' },
    { key: 'reportDept', label: '报告科室', type: 'text' },
    { key: 'reportTime', label: '报告时间', type: 'text' },
    { key: 'patient', label: '就诊人姓名', type: 'text' }
];

// 渲染报告列表
function renderReports() {
    const listEl = document.getElementById('reportList');
    if (!listEl) return;

    listEl.innerHTML = reports.map(item => `
        <div class="report-card" data-id="${item.id}">
            <div class="card-header">
                <div class="order-no">
                    <span class="label">报告单号：</span>
                    <span class="value editable-text" data-id="${item.id}" data-field="reportNo">${item.reportNo}</span>
                </div>
                <span class="status-tag report-status">${item.status}</span>
            </div>
            <div class="info-list">
                ${fieldConfig.map(field => `
                    <div class="info-row">
                        <div class="info-label">${field.label}</div>
                        <div class="info-value ${field.class || ''}" 
                             data-id="${item.id}" 
                             data-field="${field.key}">
                            ${item[field.key] || ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer card-footer-right">
                <button class="btn btn-solid">查看报告</button>
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

// 绑定可编辑文本事件（报告单号、用户名等）
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

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        const report = reports.find(r => r.id === id);
        if (report) {
            report[field] = newValue;
        }
        el.textContent = report[field];
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
            const report = reports.find(r => r.id === id);
            if (report) {
                report[field] = newValue;
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
document.addEventListener('DOMContentLoaded', renderReports);
