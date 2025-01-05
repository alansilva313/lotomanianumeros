import { useState, useEffect } from "react";

type Aposta = {
  tipo: "lotomania" | "lotofacil";
  numeros: number[];
  data: string;
};

function App() {
  const [aposta, setAposta] = useState<Aposta | null>(null);
  const [historicoApostas, setHistoricoApostas] = useState<Aposta[]>([]);
  const [acertos, setAcertos] = useState<{ [key: number]: Set<number> }>({});
  const [filtroTipo, setFiltroTipo] = useState<"lotomania" | "lotofacil" | "todos">("todos");

  // Carregar apostas do localStorage ao iniciar
  useEffect(() => {
    const apostasSalvas = localStorage.getItem("apostas");
    if (apostasSalvas) {
      setHistoricoApostas(JSON.parse(apostasSalvas));
    }
  }, []);

  // Função para gerar números aleatórios da Lotomania
  const gerarApostaLotomania = () => {
    const numeros: number[] = [];
    while (numeros.length < 50) {
      const numeroAleatorio = Math.floor(Math.random() * 100);
      if (!numeros.includes(numeroAleatorio)) {
        numeros.push(numeroAleatorio);
      }
    }
    numeros.sort((a, b) => a - b); // Ordena em ordem crescente

    const novaAposta: Aposta = {
      tipo: "lotomania",
      numeros,
      data: new Date().toLocaleString(),
    };

    setAposta(novaAposta);
    salvarAposta(novaAposta);
  };

  // Função para gerar números aleatórios da Lotofacil
  const gerarApostaLotofacil = () => {
    const numeros: number[] = [];
    while (numeros.length < 15) {
      const numeroAleatorio = Math.floor(Math.random() * 25) + 1; // Números de 1 a 25
      if (!numeros.includes(numeroAleatorio)) {
        numeros.push(numeroAleatorio);
      }
    }
    numeros.sort((a, b) => a - b); // Ordena em ordem crescente

    const novaAposta: Aposta = {
      tipo: "lotofacil",
      numeros,
      data: new Date().toLocaleString(),
    };

    setAposta(novaAposta);
    salvarAposta(novaAposta);
  };

  // Função para salvar a aposta no histórico
  const salvarAposta = (novaAposta: Aposta) => {
    const novoHistorico = [...historicoApostas, novaAposta];
    setHistoricoApostas(novoHistorico);
    localStorage.setItem("apostas", JSON.stringify(novoHistorico));
  };

  // Função para marcar ou desmarcar múltiplos números como acertos
  const marcarNumero = (indexAposta: number, numero: number) => {
    setAcertos((prevAcertos) => {
      const novoAcertos = { ...prevAcertos };
      if (!novoAcertos[indexAposta]) {
        novoAcertos[indexAposta] = new Set();
      }

      const acertosAposta = novoAcertos[indexAposta];
      if (acertosAposta.has(numero)) {
        acertosAposta.delete(numero); // Remove o número se já estiver marcado
      } else {
        acertosAposta.add(numero); // Adiciona o número aos acertos
      }

      return novoAcertos;
    });
  };

  // Função para filtrar apostas por tipo
  const filtrarApostas = () => {
    if (filtroTipo === "todos") {
      return historicoApostas;
    }
    return historicoApostas.filter((aposta) => aposta.tipo === filtroTipo);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Gerador de Números de Lotomania e Lotofacil
      </h1>
      <div className="mb-4">
        <button
          onClick={gerarApostaLotomania}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mr-4"
        >
          Gerar Lotomania
        </button>
        <button
          onClick={gerarApostaLotofacil}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Gerar Lotofacil
        </button>
      </div>
      {aposta && (
        <div className="mt-6 text-center bg-slate-200 p-2 shadow-sm rounded">
          <h2 className="text-xl font-semibold text-gray-700">
            Última aposta ({aposta.tipo === "lotomania" ? "Lotomania" : "Lotofacil"}):
          </h2>
          <div className="grid grid-cols-10 gap-1 mt-2">
            {aposta.numeros.map((numero, index) => (
              <div
                key={index}
                className="p-2 text-gray-800 border rounded bg-white hover:bg-gray-200 cursor-pointer"
              >
                {numero}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Histórico de Apostas
        </h2>
        <div className="mb-4">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as "lotomania" | "lotofacil" | "todos")}
            className="p-2 border rounded-lg"
          >
            <option value="todos">Todos</option>
            <option value="lotomania">Lotomania</option>
            <option value="lotofacil">Lotofacil</option>
          </select>
        </div>
        <ul className="bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-64">
          {filtrarApostas().map((aposta, index) => (
            <li key={index} className="mb-4 pb-2 border-b last:border-b-0">
              <h3 className="text-gray-700 font-semibold mb-2">
                {aposta.tipo === "lotomania" ? "Lotomania" : "Lotofacil"} - Aposta {index + 1} -{" "}
                <span className="text-green-600">Acertos: {acertos[index]?.size || 0}</span>
              </h3>
              <div className="text-sm text-gray-500 mb-2">{aposta.data}</div>
              <div className="grid grid-cols-10 gap-2">
                {aposta.numeros.map((numero) => {
                  const isAcerto = acertos[index]?.has(numero);
                  return (
                    <div
                      key={numero}
                      className={`p-2 text-gray-800 border rounded ${isAcerto ? "bg-green-500 text-white" : "bg-white"}`}
                      onClick={() => marcarNumero(index, numero)}
                    >
                      {numero}
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
