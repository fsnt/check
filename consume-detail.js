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

// 消费详情基本信息
const basicInfo = {
    fundPay: '-¥13.30',
    accountPay: '¥0.00',
    cashPay: '-¥3.32',
    otherPay: '¥0.00',
    status: '医保支付成功',
    payTime: getCurrentDateTime(),
    tradeNo: '440120250816709557979'
};

// 基本信息字段配置
const basicFields = [
    { key: 'fundPay', label: '医保统筹基金支付金额' },
    { key: 'accountPay', label: '医保个人账户支付金额' },
    { key: 'cashPay', label: '个人现金支付金额' },
    { key: 'otherPay', label: '其他支付金额' },
    { key: 'status', label: '当前状态' },
    { key: 'payTime', label: '支付时间' },
    { key: 'tradeNo', label: '交易单号' }
];

// 普通门诊细项数据
let itemList = [
    { id: 1, name: '尿液分析', category: '医疗服务项目', price: '¥6.62', quantity: 1, total: '¥6.62' },
    { id: 2, name: '基层医疗卫生机构一般诊疗费', category: '医疗服务项目', price: '¥10', quantity: 1, total: '¥10' }
];

let itemIdCounter = 3;

// 渲染基本信息
function renderBasicInfo() {
    const listEl = document.getElementById('basicInfoList');
    if (!listEl) return;

    listEl.innerHTML = basicFields.map(field => `
        <div class="info-row">
            <div class="info-label">${field.label}</div>
            <div class="info-value" data-field="${field.key}" data-type="basic">
                ${basicInfo[field.key]}
            </div>
        </div>
    `).join('');

    bindBasicInfoEdit();
}

// 渲染普通门诊细项
function renderItems() {
    const listEl = document.getElementById('itemList');
    if (!listEl) return;

    listEl.innerHTML = itemList.map(item => `
        <div class="consume-item-row" data-id="${item.id}">
            <div class="consume-item-inner">
                <div class="consume-item-content">
                    <span class="col-name editable-item" data-id="${item.id}" data-field="name">${item.name}</span>
                    <span class="col-category editable-item" data-id="${item.id}" data-field="category">${item.category}</span>
                    <span class="col-price editable-item" data-id="${item.id}" data-field="price">${item.price}</span>
                    <span class="col-qty editable-item" data-id="${item.id}" data-field="quantity">${item.quantity}</span>
                    <span class="col-total editable-item" data-id="${item.id}" data-field="total">${item.total}</span>
                </div>
                <div class="item-delete-btn" data-id="${item.id}">删除</div>
            </div>
        </div>
    `).join('');

    bindItemEvents();
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
    const currentValue = basicInfo[field];

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
            basicInfo[field] = newValue;
        }
        el.textContent = basicInfo[field];
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

// 绑定细项事件
function bindItemEvents() {
    // 点击编辑
    const editableItems = document.querySelectorAll('.editable-item');
    editableItems.forEach(el => {
        el.addEventListener('click', handleItemEditClick);
    });

    // 右滑删除
    const itemRows = document.querySelectorAll('.consume-item-row');
    itemRows.forEach(row => {
        const inner = row.querySelector('.consume-item-inner');
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
            if (isOpen) diff -= 80;
            if (diff > 0) diff = 0;
            if (diff < -80) diff = -80;
            inner.style.transform = `translateX(${diff}px)`;
        });

        row.addEventListener('touchend', () => {
            isDragging = false;
            inner.style.transition = 'transform 0.3s';
            let diff = currentX - startX;
            if (isOpen) diff -= 80;
            if (diff < -40) {
                inner.style.transform = 'translateX(-80px)';
                isOpen = true;
            } else {
                inner.style.transform = 'translateX(0)';
                isOpen = false;
            }
        });

        // 鼠标模拟
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
            if (mouseIsOpen) diff -= 80;
            if (diff > 0) diff = 0;
            if (diff < -80) diff = -80;
            inner.style.transform = `translateX(${diff}px)`;
        });

        document.addEventListener('mouseup', (e) => {
            if (!mouseIsDown) return;
            mouseIsDown = false;
            inner.style.transition = 'transform 0.3s';
            let diff = e.clientX - mouseStartX;
            if (mouseIsOpen) diff -= 80;
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
        category: '待修改',
        price: '¥0',
        quantity: 1,
        total: '¥0'
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

    const currentValue = item[field];

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.style.cssText = `
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        border: 1px solid #26c2a0;
        border-radius: 4px;
        padding: 2px 6px;
        outline: none;
        background: #fff;
        font-family: inherit;
        width: 100%;
        box-sizing: border-box;
    `;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        if (newValue === '') {
            el.textContent = item[field];
            return;
        }
        if (field === 'quantity') {
            item[field] = parseInt(newValue) || 1;
        } else {
            item[field] = newValue;
        }
        el.textContent = item[field];
    };

    input.addEventListener('blur', saveValue);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
        if (e.key === 'Escape') {
            el.textContent = item[field];
        }
    });

    e.stopPropagation();
}

// 绑定顶部可编辑文本
function bindHeaderEditable() {
    const editableEls = document.querySelectorAll('.consume-hospital .editable-text, .section-total');
    editableEls.forEach(el => {
        el.addEventListener('click', handleHeaderEditClick);
    });
}

function handleHeaderEditClick(e) {
    const el = e.currentTarget;
    if (el.querySelector('input')) return;

    const currentValue = el.textContent.trim();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.style.cssText = `
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        border: 1px solid #26c2a0;
        border-radius: 4px;
        padding: 4px 8px;
        outline: none;
        background: #fff;
        font-family: inherit;
        text-align: center;
        width: 80%;
    `;

    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    const saveValue = () => {
        const newValue = input.value.trim();
        el.textContent = newValue || currentValue;
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

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
    renderBasicInfo();
    renderItems();
    bindHeaderEditable();

    // 点击「普通门诊」标题新增一条
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addNewItem);
        addBtn.style.cursor = 'pointer';
    }
});
