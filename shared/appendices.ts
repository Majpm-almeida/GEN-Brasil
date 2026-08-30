export type AppendixSelection = {
  guerraHibrida: boolean;
  lawfare: boolean;
  segurancaTransnacional: boolean;
  matrizIntegracao: boolean;
};

export function buildAppendixManifest(selection: AppendixSelection) {
  const options = [
    [selection.guerraHibrida, "Matriz de Teste — Guerra Híbrida"],
    [selection.lawfare, "Matriz de Teste — Lawfare"],
    [selection.segurancaTransnacional, "Matriz de Teste — Segurança Transnacional"],
    [selection.matrizIntegracao, "Matriz de Integração"],
  ] as const;
  return options.filter(([included]) => included).map(([, label]) => label);
}
