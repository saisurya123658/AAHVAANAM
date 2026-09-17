import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { AuditLogItem } from '../../types';
import { History, ShieldCheck, Clock, User } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs?limit=50');
      return res.data?.logs || [];
    }
  });

  const logs: AuditLogItem[] = data || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold text-gold tracking-widest">
          SECURITY & COMPLIANCE
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
          Audit Activity Trail
        </h1>
        <p className="text-xs text-gray-500">
          Immutable logs recording staff actions, status updates, and inventory changes.
        </p>
      </div>

      {/* Audit List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Loading audit trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm space-y-2">
          <History className="w-8 h-8 text-gold mx-auto" />
          <h3 className="font-serif text-lg font-bold text-primary">No Audit Logs Yet</h3>
          <p className="text-xs text-gray-500">Staff actions will be chronologically tracked here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log._id} className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-brandDark">
                      {log.action}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                      {log.entity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-gray-500">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-gold" />
                      {log.adminName || log.adminEmail}
                    </span>
                    {log.entityId && (
                      <span className="font-mono text-gray-400">
                        ID: {log.entityId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-[11px] text-gray-400 shrink-0 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
