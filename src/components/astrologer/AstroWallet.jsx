import { useData } from '../../data/DataContext';
import WalletView from '../ui/WalletView';

export default function AstroWallet({ astrologerId }) {
  const { getAstrologerWallet, getAstrologerWalletTransactions, allAstrologers } = useData();
  const astroName = allAstrologers.find(a => a.id === astrologerId)?.displayName || 'Astrologer';
  const wallet = getAstrologerWallet(astrologerId);
  const transactions = getAstrologerWalletTransactions(astrologerId);

  return (
    <WalletView
      wallet={wallet}
      transactions={transactions}
      actorName={astroName}
    />
  );
}
