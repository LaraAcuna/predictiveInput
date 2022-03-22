function makePredictive(dom, width, inputProps, availableOptions, showAllByDefault = true) {
    /*
        inputProps => object with props like... classNames, name, etc... For now, only those two
    */
    while (dom.lastChild) {
        dom.removeChild(dom.lastChild); // we don't want a dirty containter!
    }

    dom.style.width = width; //This width is for both the input and the predictive box.
    dom.style.position = 'relative';

    const input = document.createElement('INPUT');
    input.style.width = '100%';
    input.type = 'text';
    const { name, classNames } = inputProps;
    if (name)
        input.name = name;
    if (classNames) {
        if (Array.isArray(classNames)) {
            classNames.forEach(className => input.classList.add(className));
        } else {
            input.classList.add(classNames);
        }
    }

    const predictive = document.createElement('DIV');
    /*STYLES NEEDED, SHOULD NOT BE OVERWRITTEN (atleast by this moment)*/
    predictive.style.width = '100%';
    predictive.style.zIndex = 2;
    predictive.style.position = 'absolute';
    predictive.classList.add('predictive-input'); //This class provides visual styling
    predictive.classList.add('hidden'); //Initially invisible

    input.oninput = () => {
        clearPredictive(predictive);
        showPossibleOptions(availableOptions, input, predictive);
    }
    input.onblur = () => {
        clearPredictive(predictive);
    }
    input.onfocus = () => {
        showPossibleOptions(availableOptions, input, predictive, showAllByDefault);
    }

    dom.appendChild(input);
    dom.appendChild(predictive);
}

function clearPredictive(predictiveDom) {
    predictiveDom.classList.add('hidden');
    while (predictiveDom.lastChild)
        predictiveDom.removeChild(predictiveDom.lastChild);
}

function showPossibleOptions(options, input, predictiveDom, showAllByDefault) {
    const inputString = input.value.trim().toLowerCase();
    let matchedOptions = [];
    if (inputString) {
        matchedOptions = options.filter(option => {
            const { displayText, searchByDisplay = true, alternatives = null, selectAction = null } = option;
            const searchKeys = [];
            if (searchByDisplay) {
                searchKeys.push(displayText);
            }
            if (alternatives) {
                searchKeys.push(...alternatives);
            }
            return searchKeys.some(searchKey => searchKey.toLowerCase().includes(inputString));
        });
        fillPredictive(matchedOptions, input, predictiveDom);
    } else if (showAllByDefault) {
        matchedOptions = options;
        fillPredictive(matchedOptions, input, predictiveDom);
    }
    console.log(matchedOptions);
    if (matchedOptions.length > 0)
        predictiveDom.classList.remove('hidden');
    else
        predictiveDom.classList.add('hidden');
}

function fillPredictive(optionsToPut, input, predictiveDom) {
    optionsToPut.forEach(option => {
        const optionDom = createSelectableOption(option);
        optionDom.onclick = () => {
            if (option.selectAction) {
                option.selectAction();
            }
            input.blur();
        }
        predictiveDom.appendChild(optionDom);
    })
}

function createSelectableOption(option) {
    const selectableOption = document.createElement("div");
    selectableOption.appendChild(document.createTextNode(option.displayText));
    selectableOption.onmousedown = (event) => event.preventDefault();
    selectableOption.style
    return selectableOption;
}