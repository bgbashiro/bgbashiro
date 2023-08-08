var x = document.querySelector("#terminalInput")

x.addEventListener('submit', (evt) => {

    evt.preventDefault();

    let out = evt.target[0]
    let line = evt.target[1].value;

    out.innerHTML += "\n$$"
    out.innerHTML += line;

    tokens = line.toLowerCase().split(" ")
    rootCmd = tokens[0];

    try {
        rootCommands[rootCmd](tokens.slice(1), out);
    } catch (error) {
        out.innerHTML += "\n"
        out.innerHTML += `No such command >>> ${rootCmd} <<<`
        out.innerHTML += "\n"
        out.innerHTML += `No such command >>> ${error} <<<`
        out.innerHTML += "\n"
    }
})


function fnMan(args, out) {
    out.innerHTML+="\nno help avaailable yet\n"
}

function fnExit(args, out) {
    window.location.replace(`${window.location.href.split("term")[0]}`)
}

function fnList(args, out){}

function fnChatGPT(args, out){
    // going to suppress it for now
    out.innerHTML += "\n"
    out.innerHTML += "ChatGPT commands are not refined yet"
    return 
    gpt_prompt = args.join(" ")
    headers = { 'Content-Type' : 'application/json', 'Authorization' : '<<< Add OpenAI key here >>>'}
    method = 'POST'
    body = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": gpt_prompt}]
    })
    fetch("https://api.openai.com/v1/chat/completions ", {method, headers, body})
    .then(r=>r.json())
    .then(r=>{
        msg = r['choices'][0]['message']['content']
        out.innerHTML += "\n"
        out.innerHTML += "ChatGPT:\n"
        out.innerHTML += msg
        out.innerHTML += "\n"
    })
}

rootCommands = {
    "man" : fnMan,
    "exit":fnExit,
    "c":fnChatGPT
    // "ext" : (tokens, out) => {console.log("JAJA");}, // {window.location.replace(`${window.location.href.split("term")[0]}`)},
    // "list" : (tokens, out) => {console.log(args);}
}

