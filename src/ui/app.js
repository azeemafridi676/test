const { remote } = require("electron");
const main = remote.require("./main");

const userForm = document.querySelector("#userForm");
const userName = document.querySelector("#name");
const userEmail = document.querySelector("#email");
const userAddress = document.querySelector("#address");
const usersList = document.querySelector("#users");

let users = [];
let editingStatus = false;
let editUserId;

const deleteUser = async (id) => {
  const response = confirm("Are you sure you want to delete this user?");
  if (response) {
    await main.deleteUser(id);
    await getUsers();
  }
  return;
};

const editUser = async (id) => {
  const user = await main.getUserById(id);
  userName.value = user.name;
  userEmail.value = user.email;
  userAddress.value = user.address;

  editingStatus = true;
  editUserId = id;
};

userForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();

    const user = {
      name: userName.value,
      email: userEmail.value,
      address: userAddress.value,
    };

    if (!editingStatus) {
      const savedUser = await main.createUser(user);
      console.log(savedUser);
    } else {
      const userUpdated = await main.updateUser(editUserId, user);
      console.log(userUpdated);

      // Reset
      editingStatus = false;
      editUserId = "";
    }

    userForm.reset();
    userName.focus();
    getUsers();
  } catch (error) {
    console.log(error);
  }
});

function renderUsers(usersData) {
  usersList.innerHTML = "";
  usersData.forEach((u) => {
    usersList.innerHTML += `
      <div class="card card-body my-2 animated fadeInLeft">
        <h4>${u.name}</h4>
        <p>Email: ${u.email}</p>
        <p>Address: ${u.address}</p>
        <p>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.id}')">
            DELETE
          </button>
          <button class="btn btn-secondary btn-sm" onclick="editUser('${u.id}')">
            EDIT 
          </button>
        </p>
      </div>
    `;
  });
}

const getUsers = async () => {
  users = await main.getUsers();
  renderUsers(users);
};

async function init() {
  getUsers();
}

init();