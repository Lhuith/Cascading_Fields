
var Console_Open = false;
var Console;

var oldstr;
var oldinput;
var cleared;
var input_stream = [];
var pushed = true;
var screenunlocked = false;


var Console_Output;

function Console_Init() {

    Console = document.createElement("textarea");
    Console.type = "Console";
    Console.id = "Console";
    Console.className = "css-class-name"; // set the CSS class
    container.appendChild(Console); // put it into the DOM
    Console.text = "/add some shit?";
    //console.log("Making Console");

    Console_Output = document.createElement("textarea");
    Console_Output.type = "Console_Output";
    Console_Output.id = "Console_Output";
    Console_Output.className = "css-class-name"; // set the CSS class
    Console_Output.rows = "15";
    Console_Ouput.disabled = true;

    Console_Output.align = "bottom";
    container.appendChild(Console_Output); // put it into the DOM
    Console_Output.text = "/add some shit?";
    //console.log("Making Console");
}

function Get_Console_Input() {

    if (Console != undefined) {


        if (Console_Open) {
            Console.style.display = "block";
            var str = $(Console).val();
            Console.focus();
            controls.isLocked = false;
            controls.dispatchEvent({ type: 'unlock' });

            if (str != oldstr) {
                if (enter) {

                    str = str.replace(/(\r\n|\n|\r)/gm, "");

                    var commands = str.split(' ');
                    Push_To_Stream(str);

                    if (commands.join('') == "clear") {
                        console.log("clearing");
                        input_stream = [];
                        Console.value = '';
                        return;
                    } else if (commands[0] == "p") {
                        console.log("p found");

                        for (var i = 1; i < commands.length; i++) {
                            //console.log(commands[i]);
                            if (commands[i] == 'reset') {
                                Reset_Player();
                                Console_Exit(str);
                                return;
                            }

                            //if(commands[i] == 'reset'){
                            //    Reset_Player();
                            //    Push_To_Stream(str);
                            //    controls.lock();
                            //    Console.value = '';  
                            //    Console_Open = false;
                            //    return;
                            //}
                        }
                    } else if (commands[0] == "b") {
                        console.log("b found");
                        for (var i = 1; i < commands.length; i++) {
                            console.log(commands[i]);
                        }

                    } else if (commands.join('') == "sorry") {
                        Push_To_Stream('its ok');
                    } else if (commands.join('') == "love" || commands.join('') == "<3") {
                        Push_To_Stream('me love ally <3');
                    } else {
                        if (str != '')
                            Push_To_Stream('dont know what your on about mate');
                    }



                    Console.value = '';
                    Console_Output.scrollTop = Console_Output.scrollHeight;
                }

            } else {
            }
            screenunlocked = false;
            oldstr = str;

        } else {
            Console.style.display = "none";

            if (!screenunlocked) {
                screenunlocked = true;
                if (!controls.isLocked) {
                    controls.lock();
                }
            }

        }
    }
}

function Console_Exit(str) {
    Push_To_Stream(str);
    controls.lock();
    Console.value = '';
    Console_Open = false;
    Console_Output.scrollTop = Console_Output.scrollHeight;
}

function Console_Ouput() {

    if (Console != undefined) {
        if (Console_Open) {
            Console_Output.style.display = "block";
            //$('#Console_Output').val(input_stream);
            Console_Output.value = input_stream.join("\n");

            for (var i = 0; i < input_stream.length; i++) {

            }
        } else {
            Console_Output.style.display = "none";
        }

    }

}

function Push_To_Stream(text) {

    pushed = false;
    if (!pushed) {
        pushed = true;
        if (text != '')
            input_stream.push(text);
    }

}

function Clear_Console() {

    if (!cleared) {
        cleared = true;
        Console.value = '';
    }
}