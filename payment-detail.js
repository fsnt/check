// 缴费详情数据
const detailData = {
    patient: '人名',
    serialNo: '2026031468717',
    department: '中医科门诊',
    totalAmount: '540.00 元',
    actualPay: '215.99 元',
    payStatus: '支付成功',
    payMethod: '微信'
};

// 基本信息字段配置
const basicFields = [
    { key: 'patient', label: '就诊人姓名', type: 'text' },
    { key: 'serialNo', label: '就诊流水号', type: 'text' },
    { key: 'department', label: '就诊科室', type: 'text' },
    { key: 'totalAmount', label: '订单总金额', type: 'text' },
    { key: 'actualPay', label: '实际支付', type: 'text', class: 'actual-pay' },
    { key: 'payStatus', label: '缴费状态', type: 'text', class: 'pay-status' },
    { key: 'payMethod', label: '支付方式', type: 'text' }
];

// 缴费细项数据
let itemList = [
    { id: 1, name: '磁共振(MR)平扫', price: '505.00 元', quantity: 1 },
    { id: 2, name: '主任医师门诊诊查费', price: '35.00 元', quantity: 1 }
];

let itemIdCounter = 3;

// 渲染基本信息
function renderBasicInfo() {
    const listEl = document.getElementById('basicInfoList');
    if (!listEl) return;

    listEl.innerHTML = basicFields.map(field => `
        <div class="info-row">
            <div class="info-label">${field.label}</div>
            <div class="info-value ${field.class || ''}" 
                 data-field="${field.key}"
                 data-type="basic">
                ${detailData[field.key]}
            </div>
        </div>
    `).join('');
}

// 渲染缴费细项
function renderItems() {
    const listEl = document.getElementById('itemList');
    if (!listEl) return;

    listEl.innerHTML = itemList.map(item => `
        <div class="item-row" data-id="${item.id}">
            <div class="item-row-inner">
                <div class="item-content">
                    <div class="item-main">
                        <span class="item-name editable-item" data-id="${item.id}" data-field="name">${item.name}</span>
                        <span class="item-price editable-item" data-id="${item.id}" data-field="price">${item.price}</span>
                    </div>
                    <div class="item-sub">
                        <span class="item-quantity editable-item" data-id="${item.id}" data-field="quantity">数量 ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-delete-btn" data-id="${item.id}">删除</div>
            </div>
        </div>
    `).join('');

    bindItemEvents();
}

// 绑定细项事件
function bindItemEvents() {
    // 点击细项名称/价格/数量编辑
    const editableItems = document.querySelectorAll('.editable-item');
    editableItems.forEach(el => {
        el.addEventListener('click', handleItemEditClick);
    });

    // 右滑删除
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach(row => {
        const inner = row.querySelector('.item-row-inner');
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let isOpen = false;

        row.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            inner.style.transition = 'none';
        });

        row.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            let diff = currentX - startX;
            if (isOpen) {
                diff -= 80;
            }
            if (diff > 0) diff = 0;
            if (diff < -80) diff = -80;
            inner.style.transform = `translateX(${diff}px)`;
        });

        row.addEventListener('touchend', () => {
            isDragging = false;
            inner.style.transition = 'transform 0.3s';
            let diff = currentX - startX;
            if (isOpen) {
                diff -= 80;
            }
            if (diff < -40) {
                inner.style.transform = 'translateX(-80px)';
                isOpen = true;
            } else {
                inner.style.transform = 'translateX(0)';
                isOpen = false;
            }
        });

        // 鼠标模拟（桌面端测试用）
        let mouseStartX = 0;
        let mouseIsDown = false;
        let mouseIsOpen = false;

        row.addEventListener('mousedown', (e) => {
            if (e.target.closest('.editable-item') || e.target.closest('.item-delete-btn')) return;
            mouseStartX = e.clientX;
            mouseIsDown = true;
            inner.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!mouseIsDown) return;
            let diff = e.clientX - mouseStartX;
            if (mouseIsOpen) {
                diff -= 80;
            }
            if (diff > 0) diff = 0;
            if (diff < -80) diff = -80;
            inner.style.transform = `translateX(${diff}px)`;
        });

        document.addEventListener('mouseup', (e) => {
            if (!mouseIsDown) return;
            mouseIsDown = false;
            inner.style.transition = 'transform 0.3s';
            let diff = e.clientX - mouseStartX;
            if (mouseIsOpen) {
                diff -= 80;
            }
            if (diff < -40) {
                inner.style.transform = 'translateX(-80px)';
                mouseIsOpen = true;
            } else {
                inner.style.transform = 'translateX(0)';
                mouseIsOpen = false;
            }
        });
    });

    // 删除按钮
    const deleteBtns = document.querySelectorAll('.item-delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            itemList = itemList.filter(item => item.id !== id);
            renderItems();
            e.stopPropagation();
        });
    });
}

// 新增细项
function addNewItem() {
    itemList.push({
        id: itemIdCounter++,
        name: '待修改',
        price: '0元',
        quantity: 1
    });
    renderItems();
}

// 点击细项字段编辑
function handleItemEditClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const id = parseInt(el.dataset.id);
    const field = el.dataset.field;
    const item = itemList.find(i => i.id === id);
    if (!item) return;

    let currentValue = item[field];
    // 数量字段显示"数量 1"，编辑时只取数字
    if (field === 'quantity') {
        currentValue = item.quantity;
    }

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
        width: ${Math.max(String(currentValue).length * 1.2, 4)}em;
    `;

    const originalHTML = el.innerHTML;
    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue === '') {
            if (field === 'quantity') {
                el.textContent = `数量 ${item[field]}`;
            } else {
                el.textContent = item[field];
            }
            return;
        }

        if (field === 'quantity') {
            item[field] = parseInt(newValue) || 1;
            el.textContent = `数量 ${item[field]}`;
        } else {
            item[field] = newValue;
            el.textContent = newValue;
        }
    };

    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
        if (e.key === 'Escape') {
            if (field === 'quantity') {
                el.textContent = `数量 ${item[field]}`;
            } else {
                el.textContent = item[field];
            }
        }
    });

    e.stopPropagation();
}

// 绑定基本信息编辑
function bindBasicInfoEdit() {
    const valueEls = document.querySelectorAll('.info-value[data-type="basic"]');
    valueEls.forEach(el => {
        el.addEventListener('click', handleBasicInfoClick);
    });
}

function handleBasicInfoClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const field = el.dataset.field;
    const currentValue = detailData[field];

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue !== '') {
            detailData[field] = newValue;
        }
        el.textContent = detailData[field];
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

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
    renderBasicInfo();
    renderItems();
    bindBasicInfoEdit();

    // 点击「缴费细项」标题新增一条
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addNewItem);
        addBtn.style.cursor = 'pointer';
    }
});
