
/**
 * Serviço para integração com Stripe Checkout via Payment Links.
 */

const STRIPE_LINKS: Record<string, string> = {
  'price_basico': 'https://buy.stripe.com/exemplo_basico', 
  // Link fornecido pelo usuário para o plano Start (prod_TzUJ3EbgFL26nD)
  'prod_TzUJ3EbgFL26nD': 'https://buy.stripe.com/test_eVq7sM4vl8011Ed9r1aVa00', 
  'price_premium': 'https://buy.stripe.com/exemplo_premium'
};

export const handleStripeCheckout = async (priceId: string, userEmail?: string) => {
  const paymentUrl = STRIPE_LINKS[priceId];

  // Removida a trava de placeholders para permitir que o link real funcione imediatamente
  if (!paymentUrl || paymentUrl === '') {
    console.error(`Link de pagamento não configurado para o ID: ${priceId}`);
    alert("Configuração Pendente: O link de pagamento para este plano ainda não foi configurado no sistema.");
    return;
  }

  try {
    const url = new URL(paymentUrl);
    
    // Preenche automaticamente o e-mail do professor na tela de pagamento para facilitar a compra
    if (userEmail) {
      url.searchParams.set('prefilled_email', userEmail);
    }
    
    // Adiciona parâmetro de sucesso para que o App saiba quando o usuário retornar
    // Nota: Para isso funcionar 100%, você deve configurar a "Página de Confirmação" 
    // no Dashboard do Stripe para redirecionar de volta para o seu site com ?success=true
    
    // Redireciona para o checkout seguro do Stripe
    window.location.href = url.toString();
  } catch (e) {
    console.error("Erro ao processar URL de checkout:", e);
    alert("Erro na URL de pagamento. Verifique se o link colado no stripeService.ts é válido.");
  }
};
