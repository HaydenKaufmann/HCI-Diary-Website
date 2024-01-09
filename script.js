function saveInput() {
    var inputText = document.getElementById('userInput').value;
    var inputTimestamp = new Date().toLocaleString();
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    
    savedInputs.push({ text: inputText, timestamp: inputTimestamp });
    localStorage.setItem('savedInputs', JSON.stringify(savedInputs));
    
    document.getElementById('userInput').value = '';
    displaySavedInputs();
    applyButtonColor();
    togglePopup();
}

function displaySavedInputs() {
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    var displayArea = document.getElementById('savedInputs');

    displayArea.innerHTML = '<span class="saved-entries-label" style="font-size: 20px;">Saved Entries:</span><br>';

    for (var i = savedInputs.length - 1; i >= 0; i--) {
        let input = savedInputs[i];
        displayArea.innerHTML += `
        <div class="saved-input" id="input_${i}">
            ${i + 1}. <div class="input-text">${input.text}</div> (Saved on: ${input.timestamp})
            <button onclick="editInput(${i})">Edit</button>
            <button onclick="deleteInput(${i})">Delete</button>
        </div>
    `;
    }
    applyButtonColor();
    changeBackgroundColor(localStorage.getItem('bgColor') || '#f3f3f3');
}


function editInput(index) {
    openEditInput(index);
    applyButtonColor();
}

function deleteInput(index) {
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    savedInputs.splice(index, 1);
    localStorage.setItem('savedInputs', JSON.stringify(savedInputs));
    displaySavedInputs();
    applyButtonColor();
}

function downloadInputs() {
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    var date = new Date().toISOString().split('T')[0];
    var filename = `${date} Diary.json`;

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedInputs));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadFromFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            try {
                var json = JSON.parse(contents);
                if (Array.isArray(json)) {
                    localStorage.setItem('savedInputs', contents);
                    displaySavedInputs();
                } else {
                    alert('Invalid file format');
                }
            } catch (error) {
                alert('Error reading file: ' + error);
            }
        };
        reader.readAsText(file);
    }
    fileInput.value = '';
}

var currentEditingIndex = null;

function toggleEditPopup() {
    var popup = document.getElementById("editPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function openEditInput(index) {
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    document.getElementById('editInput').value = savedInputs[index].text;
    currentEditingIndex = index;
    toggleEditPopup();
}

function saveEdit() {
    var editedText = document.getElementById('editInput').value;
    var savedInputs = JSON.parse(localStorage.getItem('savedInputs')) || [];
    
    if (currentEditingIndex !== null) {
        savedInputs[currentEditingIndex].text = editedText;
        savedInputs[currentEditingIndex].timestamp = new Date().toLocaleString();
        localStorage.setItem('savedInputs', JSON.stringify(savedInputs));
        displaySavedInputs();
        toggleEditPopup();
    }
}

function togglePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = (popup.style.display === "block" ? "none" : "block");
    toggleReflectionPopup()
}

function toggleReflectionPopup() {
    var reflectionPopup = document.getElementById("reflectionPopup");
    reflectionPopup.style.display = (reflectionPopup.style.display === "block" ? "none" : "block");
}

function toggleColorPopup() {
    var popup = document.getElementById("colorPopup");
    colorPopup.style.display = colorPopup.style.display === "block" ? "none" : "block";
}

function changeButtonColor(color) {
    localStorage.setItem('buttonColor', color);
    applyButtonColor();
}

function getBrightness(color) {
    var r, g, b, brightness;
    if (color.match(/^rgb/)) {
        color = color.match(/rgba?\(([^)]+)\)/)[1];
        [r, g, b] = color.split(',').map(Number);
    } else {
        var rgb = parseInt(color.slice(1), 16);
        r = (rgb >> 16) & 0xff;
        g = (rgb >>  8) & 0xff;
        b = (rgb >>  0) & 0xff;
    }
    brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness;
}

function applyButtonColor() {
    var color = localStorage.getItem('buttonColor') || '#4CAF50';
    var textColor = getBrightness(color) < 128 ? 'white' : 'black'; 

    var buttons = document.querySelectorAll('button');
    var closes = document.querySelectorAll('.close');
    buttons.forEach(function(button) {
        button.style.backgroundColor = color;
        button.style.color = textColor;
        button.style.borderColor = textColor;
    });
    closes.forEach(function(close) {
        close.style.backgroundColor = color;
        close.style.color = textColor;
        close.style.borderColor = textColor;
    });
}

function changeBackgroundColor(color) {
    localStorage.setItem('bgColor', color);
    document.body.style.backgroundColor = color;

    var textColor = getBrightness(color) < 128 ? 'white' : 'black';
    var h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(function(h2) {
        h2.style.color = textColor;
    });
    var h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(function(h1) {
        h1.style.color = textColor;
    });

    var savedEntriesLabel = document.querySelector('.saved-entries-label');
    if (savedEntriesLabel) {
        savedEntriesLabel.style.color = textColor;
    }
}

function toggleColorSettingsPopup() {
    var popup = document.getElementById("colorSettingsPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

async function generateReflectionQuestion() {
    const apiKey = ''; //Insert Key
    const prompt = "Generate a daily reflection question for a diary user. The question should be introspective, encouraging positive thinking and self-awareness.";
    const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 100
        }),
    });

    const data = await response.json();
    document.getElementById("question").innerText = data.choices[0].text.trim();
}

window.onload = function() {
    displaySavedInputs();
    var bgColor = localStorage.getItem('bgColor') || '#f3f3f3';
    document.body.style.backgroundColor = bgColor;
    applyButtonColor();
    changeBackgroundColor(bgColor);
};
