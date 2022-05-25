require('colors')

const headerApp = () => {
    // console.clear();

    console.log(greenText('============================='));
    console.log(greenText('       Select an option'));
    console.log(greenText('============================='));

    console.log('\n');
}

const greenText = text => {
    return text.green;
}

module.exports = {
    headerApp
}
