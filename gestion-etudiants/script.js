// Variables globales
let students = [];
let currentEditId = null;

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    updateStats();
});

// Charger les étudiants depuis localStorage
function loadStudents() {
    const storedData = localStorage.getItem('students');
    if (storedData) {
        students = JSON.parse(storedData);
    }
    displayStudents(students);
}

// Sauvegarder les étudiants dans localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
    updateStats();
}

// Mettre à jour les statistiques
function updateStats() {
    document.getElementById('totalStudents').textContent = students.length;
    
    // Compter les étudiants ajoutés ce mois-ci
    const now = new Date();
    const thisMonth = students.filter(s => {
        const date = new Date(s.dateCreation);
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear();
    }).length;
    document.getElementById('newThisMonth').textContent = thisMonth;
}

// Afficher les étudiants dans le tableau
function displayStudents(studentList) {
    const tbody = document.getElementById('studentTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    const tableContainer = document.querySelector('.table-container');
    
    tbody.innerHTML = '';
    
    if (studentList.length === 0) {
        tableContainer.style.display = 'none';
        noDataMessage.style.display = 'block';
        return;
    }
    
    tableContainer.style.display = 'block';
    noDataMessage.style.display = 'none';
    
    studentList.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.id}</td>
            <td><strong>${student.nom}</strong></td>
            <td>${student.prenom}</td>
            <td>${student.age} ans</td>
            <td>${student.email}</td>
            <td><span class="filiere-badge">${student.filiere}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal(${student.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn btn-delete" onclick="deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Ajouter un nouvel étudiant
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value.trim();
    const filiere = document.getElementById('filiere').value;
    
    // Vérifier si l'email existe déjà
    const emailExists = students.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        showNotification('Cet email existe déjà!', 'error');
        return;
    }
    
    // Créer le nouvel étudiant
    const newStudent = {
        id: generateId(),
        nom: nom,
        prenom: prenom,
        age: age,
        email: email,
        filiere: filiere,
        dateCreation: new Date().toISOString()
    };
    
    students.push(newStudent);
    saveStudents();
    displayStudents(students);
    
    // Réinitialiser le formulaire
    this.reset();
    
    showNotification('Étudiant ajouté avec succès!', 'success');
});

// Générer un ID unique
function generateId() {
    if (students.length === 0) return 1;
    return Math.max(...students.map(s => s.id)) + 1;
}

// Rechercher des étudiants
function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        displayStudents(students);
        return;
    }
    
    const filtered = students.filter(s => 
        s.nom.toLowerCase().includes(searchTerm) ||
        s.prenom.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm) ||
        s.filiere.toLowerCase().includes(searchTerm)
    );
    
    displayStudents(filtered);
}

// Recherche en temps réel
document.getElementById('searchInput').addEventListener('input', function() {
    searchStudents();
});

// Ouvrir le modal de modification
function openEditModal(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    currentEditId = id;
    document.getElementById('editId').value = id;
    document.getElementById('editNom').value = student.nom;
    document.getElementById('editPrenom').value = student.prenom;
    document.getElementById('editAge').value = student.age;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editFiliere').value = student.filiere;
    
    document.getElementById('editModal').style.display = 'block';
}

// Fermer le modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

// Modifier un étudiant
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const nom = document.getElementById('editNom').value.trim();
    const prenom = document.getElementById('editPrenom').value.trim();
    const age = parseInt(document.getElementById('editAge').value);
    const email = document.getElementById('editEmail').value.trim();
    const filiere = document.getElementById('editFiliere').value;
    
    // Vérifier si l'email existe déjà (en excluant l'étudiant actuel)
    const emailExists = students.some(s => 
        s.email.toLowerCase() === email.toLowerCase() && s.id !== id
    );
    if (emailExists) {
        showNotification('Cet email existe déjà!', 'error');
        return;
    }
    
    // Mettre à jour l'étudiant
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = {
            ...students[index],
            nom: nom,
            prenom: prenom,
            age: age,
            email: email,
            filiere: filiere
        };
        
        saveStudents();
        displayStudents(students);
        closeModal();
        
        showNotification('Étudiant modifié avec succès!', 'success');
    }
});

// Supprimer un étudiant
function deleteStudent(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant?')) {
        return;
    }
    
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students.splice(index, 1);
        saveStudents();
        displayStudents(students);
        
        showNotification('Étudiant supprimé avec succès!', 'success');
    }
}

// Afficher une notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Ajouter des styles pour le badge de filière
const style = document.createElement('style');
style.textContent = `
    .filiere-badge {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
