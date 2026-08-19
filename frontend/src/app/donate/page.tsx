'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchCampaigns, createDonation } from '@/lib/api';
import { RefreshCw, Heart, DollarSign, Package, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function DonatePage() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [tab, setTab] = useState<'monetary' | 'item'>('monetary');

  // Monetary form
  const [amount, setAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Item form
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('clothing');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [pickupAddress, setPickupAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch { /* ignore */ }
      finally { setLoadingCampaigns(false); }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!session?.access_token) {
      setErrorMsg('Please log in to donate.');
      return;
    }
    setLoading(true);
    try {
      if (tab === 'monetary') {
        if (!amount || parseFloat(amount) <= 0) {
          setErrorMsg('Please enter a valid amount.');
          setLoading(false);
          return;
        }
        await createDonation({
          donation_type: 'monetary',
          amount: parseFloat(amount),
          campaign_id: selectedCampaign || undefined,
        }, session.access_token);
        setSuccessMsg('Thank you for your generous donation! 🙏');
        setAmount('');
        setSelectedCampaign('');
      } else {
        if (!itemName) {
          setErrorMsg('Please enter item name.');
          setLoading(false);
          return;
        }
        await createDonation({
          donation_type: 'item',
          item_name: itemName,
          item_category: itemCategory,
          item_quantity: parseInt(itemQuantity) || 1,
          pickup_address: pickupAddress || undefined,
        }, session.access_token);
        setSuccessMsg('Item donation submitted! We will arrange pickup shortly. 🎁');
        setItemName('');
        setItemCategory('clothing');
        setItemQuantity('1');
        setPickupAddress('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center"><RefreshCw className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  const presetAmounts = [100, 500, 1000, 2500, 5000];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Make a Donation</h1>
        <p className="text-sm text-muted max-w-lg mx-auto">Every contribution helps provide food, shelter, and hope. Choose how you&apos;d like to help.</p>
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Active Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map((c: any) => {
              const progress = c.target_amount ? Math.min(100, Math.round((c.current_amount || 0) / c.target_amount * 100)) : 0;
              return (
                <div key={c.id} className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted line-clamp-2">{c.description}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted">₹{(c.current_amount || 0).toLocaleString('en-IN')} raised</span>
                      <span className="font-semibold text-foreground">₹{(c.target_amount || 0).toLocaleString('en-IN')} goal</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-muted">
                      <TrendingUp className="w-3 h-3" /><span>{progress}% funded</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donation Form */}
      <div className="bg-card border border-border/40 rounded-3xl p-8 sm:p-12 shadow-xl shadow-foreground/[0.01]">

        {/* Tab Switch */}
        <div className="flex bg-background rounded-xl p-1 mb-8 max-w-sm mx-auto">
          <button onClick={() => setTab('monetary')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'monetary' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-foreground'}`}>
            <DollarSign className="w-4 h-4" /><span>Monetary</span>
          </button>
          <button onClick={() => setTab('item')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'item' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-foreground'}`}>
            <Package className="w-4 h-4" /><span>Item Donation</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /><span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {tab === 'monetary' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">Amount (₹) *</label>
                <input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-lg font-bold focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {presetAmounts.map((p) => (
                    <button key={p} type="button" onClick={() => setAmount(String(p))}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${amount === String(p) ? 'bg-primary text-white border-primary' : 'border-border/60 text-muted hover:border-primary/40 hover:text-foreground'}`}>
                      ₹{p.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
              {campaigns.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">Donate to Campaign (Optional)</label>
                  <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all">
                    <option value="">General Fund</option>
                    {campaigns.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">Item Name *</label>
                <input type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g., Winter Jacket, Blankets"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">Category</label>
                  <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all">
                    <option value="clothing">Clothing</option>
                    <option value="food">Food</option>
                    <option value="blankets">Blankets</option>
                    <option value="hygiene">Hygiene Products</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted">Quantity</label>
                  <input type="number" min="1" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted">Pickup Address (Optional)</label>
                <input type="text" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Your address for item pickup"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-transparent text-sm focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all" />
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50">
            <Heart className="w-4 h-4" /><span>{loading ? 'Processing...' : tab === 'monetary' ? 'Donate Now' : 'Submit Item Donation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
