using System;

namespace YourApp.Models
{
    public class Pessoa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateTime Aniversario { get; set; }
        public bool Ativo { get; set; }
        public double Altura { get; set; }
        public char Inicial { get; set; }
        public float Salario { get; set; }
        public decimal Saldo { get; set; }
        public long Distancia { get; set; }
        public byte Idade { get; set; }

        public int FornecedorId { get; set; } 
        public string FornecedorNome { get; set; }

        public string Endereco { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string Pais { get; set; }
        public string CEP { get; set; }
        public string Telefone { get; set; }

        public bool IsAdmin { get; set; } 
        public int NivelAcesso { get; set; }
    }
}
