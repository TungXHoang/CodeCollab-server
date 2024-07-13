interface keyable {
	[key: string]: string  
}

export const codeSnippets:keyable = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("user");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
	php: "<?php\n\n$name = 'Alex';\necho $name;\n",
	cpp: "#include <iostream>\\n\\nint main() {\\n std::cout << \\\"Hello World!\\\";\\n return 0;\\n};",
	c: "#include <stdio.h>\nint main() {\n   printf(\"Hello, World!\");\n   return 0;\n}",
	elixir: "defmodule HelloWorld do\n def hello do\n    IO.puts(\"Hello, World!\")\n  end\nend\n\nHelloWorld.hello()",
	fortran: "program hello\n  print *, \"Hello, World!\"\nend program hello",
	fsharp: 'printfn "Hello, World!"',
	go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
	haskell: 'main :: IO ()\nmain = putStrLn "Hello, World!"',
	kotlin: 'fun main() {\n    println("Hello, World!")\n}',
	objectivec: '#import <Foundation/Foundation.h>\n\nint main(int argc, const char * argv[]) {\n    @autoreleasepool {\n        NSLog(@"Hello, World!");\n    }\n    return 0;\n}',
	pascal: "program HelloWorld;\nbegin\n	writeln('Hello, World!');\nend.",
	perl: '#!/usr/bin/perl\n\nuse strict;\nuse warnings;\n\nprint "Hello, World!\\n";\n',
	r: 'cat("Hello, World!\\n")',
	ruby: 'puts "Hello, World!"',
	rust: 'fn main() {\n    println!("Hello, World!");\n}',
	scala: 'object HelloWorld {\n  def main(args: Array[String]): Unit = {\n    println("Hello, World!")\n  }\n}',
	sql: "SELECT 'Hello, World!' AS greeting;",
	swift: 'print("Hello, World!")',
};
