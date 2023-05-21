const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

function ListaProdutos() {
  //Cria função para ler o JSON
  try {
    const dados = JSON.parse(fs.readFileSync("./dados.json", "utf-8")); // Lê o arquivo e converte para JSON
    let html = "<table style='border-collapse: collapse;'>";
    html +=
      "<tr><th style='border: 1px solid black; padding: 8px;'>Nome</th><th style='border: 1px solid black; padding: 8px;'>Peso</th><th style='border: 1px solid black; padding: 8px;'>Quantidade</th><th style='border: 1px solid black; padding: 8px;'>Codigo do Produto</th></tr>";

    dados.produtos.forEach((produto) => {
      html += `<tr><td style='border: 1px solid black; padding: 8px;'>${produto.nome}</td><td style='border: 1px solid black; padding: 8px;'>${produto.peso}</td><td style='border: 1px solid black; padding: 8px;'>${produto.quantidade}</td><td style='border: 1px solid black; padding: 8px;'>${produto.codigo}</td></tr>`;
    });

    html += "</table>";

    return html;
  } catch (err) {
    console.log(err);
  }
}

function CriarProduto(novoProduto) {
  //Cria função para ler o JSON
  try {
    const dados = JSON.parse(fs.readFileSync("./dados.json", "utf-8")); // Lê o arquivo e converte para JSON
    dados.produtos.push(novoProduto);
    fs.writeFileSync("./dados.json", JSON.stringify(dados)); // Escreve o novo arquivo JSON
    return "Produto cadastrado com sucesso!";
  } catch (err) {
    console.log(err);
    return "Erro ao cadastrar o produto.";
  }
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  switch (url) {
    case "/":
      fs.readFile("./produtos.html", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Erro interno do servidor");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
      break;
    case "/produto":
      switch (method) {
        case "GET":
          res.write("<html>");
          res.write("<head><title>Lista de Produtos</title></head>");
          res.write(ListaProdutos());
          res.write("</html>");
          return res.end();
        case "POST":
          let data = "";
          req.on("data", (chunk) => {
            data += chunk;
          });
          req.on("end", () => {
            const formData = querystring.parse(data); // Converte os dados em um objeto JavaScript
            const novoProduto = {
              nome: formData.nome,
              peso: parseFloat(formData.peso),
              quantidade: parseInt(formData.quantidade),
              codigo: formData.codigo,
            };

            const resultado = CriarProduto(novoProduto);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(resultado);
          });
          break;
      }
  }
});
server.listen(3000);
