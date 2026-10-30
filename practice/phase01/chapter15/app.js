const API_URL = 'https://jsonplaceholder.typicode.com/users';
const memberList = document.querySelector('#member-list');
const memberDetail = document.querySelector('#member-detail');
const memberForm = document.querySelector('#member-form');
const statusBox = document.querySelector('#status');
const formMessage = document.querySelector('#form-message');

let members = [];

function renderLoading() {
    statusBox.textContent = '불러오는 중...';
    memberList.innerHTML = '';
}

function renderError(message) {
    statusBox.textContent = message;
    memberList.innerHTML = '';
}

function renderEmpty() {
    statusBox.textContent = '등록된 회원이 없습니다.';
    memberList.innerHTML = '';
}

function renderMemberDetail(member) {
    memberDetail.innerHTML = `
        <h3>${member.name}</h3>
        <p>${member.email}</p>
        <p>ID: ${member.id ?? '-'}</p>
    `;
}

function renderMembers() {
    memberList.innerHTML = '';
    if (members.length === 0) {
        renderEmpty();
        return;
    }

    statusBox.textContent = `총 ${members.length}명`;
    members.forEach((member) => {
        const button = document.createElement('button');
        button.className = 'member-card';
        button.textContent = `${member.name} - ${member.email}`;
        button.addEventListener('click', () => renderMemberDetail(member));
        memberList.append(button);
    });
}

async function loadMembers() {
    renderLoading();
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        members = await response.json();
        renderMembers();
    } catch (error) {
        console.error(error);
        renderError('회원 정보를 불러오지 못했습니다.');
    }
}

async function createMember(member) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(member)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}


memberForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(memberForm);
    const inputMember = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim()
    };

    formMessage.textContent = '등록 요청 중...';

    try {
        const createdMember = await createMember(inputMember);
        formMessage.textContent = '등록 요청 성공';
        console.log('POST Response', createdMember);
        memberForm.reset();
    } catch (error) {
        console.error(error);
        formMessage.textContent = '등록 요청 실패';
    }
});

loadMembers();