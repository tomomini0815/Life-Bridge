import { useState, useEffect } from 'react';
import { Memo, CheckboxItem } from '@/types/memo';
import { memoService } from '@/services/MemoService';
import { useAuth } from '@/contexts/AuthContext';
import {
    Plus,
    Search,
    StickyNote,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MemoCard } from './MemoCard';

export function MemoManager() {
    const { user } = useAuth();
    const [memos, setMemos] = useState<Memo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadMemos();
        } else {
            setMemos([]);
            setIsLoading(false);
        }
    }, [user]);

    const loadMemos = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            await memoService.setUser(user.id);
            const allMemos = memoService.getAllMemos();
            setMemos(allMemos);
        } catch (error) {
            console.error('Failed to load memos:', error);
            toast.error('メモの読み込みに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMemos = searchQuery
        ? memoService.searchMemos(searchQuery)
        : memos;

    const pinnedMemos = filteredMemos.filter(m => m.isPinned);
    const unpinnedMemos = filteredMemos.filter(m => !m.isPinned);

    const handleCreate = async () => {
        if (!newTitle.trim() && !newContent.trim()) return;

        try {
            await memoService.createMemo(
                newTitle.trim() || '無題のメモ',
                newContent
            );
            setNewTitle('');
            setNewContent('');
            setIsCreating(false);
            await loadMemos();
            toast.success('メモを作成しました');
        } catch (error) {
            console.error('Failed to create memo:', error);
            toast.error('メモの作成に失敗しました');
        }
    };

    const handleEdit = (memo: Memo) => {
        setEditingId(memo.id);
        setEditTitle(memo.title);
        // User requested to keep checkboxes as is (no conversion to markdown),
        // so we only edit the text content.
        setEditContent(memo.content);
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            // Reverted to updateMemo (preserving existing checkboxes in DB implicitly by not updating them here)
            // Note: If we wanted to allow editing checkboxes, we'd need a UI for it.
            // For now, consistent with "don't change checkboxes".
            await memoService.updateMemo(editingId, {
                title: editTitle.trim() || '無題のメモ',
                content: editContent,
            });
            setEditingId(null);
            await loadMemos();
            toast.success('メモを更新しました');
        } catch (error) {
            console.error('Failed to update memo:', error);
            toast.error('メモの更新に失敗しました');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await memoService.deleteMemo(id);
            await loadMemos();
            toast.success('メモを削除しました');
        } catch (error) {
            console.error('Failed to delete memo:', error);
            toast.error('メモの削除に失敗しました');
        }
    };

    const handleTogglePin = async (id: string) => {
        try {
            await memoService.togglePin(id);
            await loadMemos();
        } catch (error) {
            console.error('Failed to toggle pin:', error);
            toast.error('ピン留めの切り替えに失敗しました');
        }
    };

    const handleToggleCheckbox = async (memoId: string, itemId: string) => {
        try {
            await memoService.toggleCheckboxItem(memoId, itemId);
            await loadMemos();
        } catch (error) {
            console.error('Failed to toggle checkbox:', error);
            toast.error('チェックボックスの更新に失敗しました');
        }
    };

    const handleInlineContentUpdate = async (memoId: string, newContent: string) => {
        try {
            await memoService.updateMemo(memoId, { content: newContent });
            await loadMemos();
        } catch (error) {
            console.error('Failed to update inline content:', error);
            toast.error('メモの更新に失敗しました');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
            <div className="glass-medium rounded-3xl p-8 border border-border/50 shadow-soft">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <StickyNote className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground font-display whitespace-nowrap">メモ</h1>
                            <p className="text-muted-foreground whitespace-nowrap">アイデアやTODOを自由に記録</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsCreating(true)} className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 self-end">
                        <Plus className="w-5 h-5" />
                        新しいメモ
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl px-1">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="メモを検索"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                    />
                </div>
            </div>

            {/* Create New Memo */}
            {isCreating ? (
                <div className="max-w-2xl">
                    <div className="rounded-xl border border-border bg-card shadow-md p-4 space-y-3">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="タイトル"
                            className="w-full px-0 py-1 bg-transparent border-0 text-base font-medium focus:outline-none placeholder:text-muted-foreground"
                            autoFocus
                        />
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            placeholder="メモを入力..."
                            rows={4}
                            className="w-full px-0 py-1 bg-transparent border-0 text-sm focus:outline-none resize-none placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2 justify-end pt-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewTitle('');
                                    setNewContent('');
                                }}
                            >
                                キャンセル
                            </Button>
                            <Button size="sm" onClick={handleCreate}>
                                完了
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="max-w-2xl w-full px-4 py-3 rounded-lg border border-border bg-card hover:shadow-md transition-shadow text-left text-muted-foreground"
                >
                    メモを入力...
                </button>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Pinned Memos */}
            {!isLoading && pinnedMemos.length > 0 && (
                <div>
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                        ピン留め済み
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pinnedMemos.map((memo) => (
                            <MemoCard
                                key={memo.id}
                                memo={memo}
                                isEditing={editingId === memo.id}
                                editTitle={editTitle}
                                editContent={editContent}
                                onEditTitleChange={setEditTitle}
                                onEditContentChange={setEditContent}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingId(null)}
                                onEditStart={handleEdit}
                                onDelete={handleDelete}
                                onTogglePin={handleTogglePin}
                                onToggleCheckbox={handleToggleCheckbox}
                                onContentUpdate={handleInlineContentUpdate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Memos */}
            {!isLoading && unpinnedMemos.length > 0 && (
                <div>
                    {pinnedMemos.length > 0 && (
                        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            その他
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {unpinnedMemos.map((memo) => (
                            <MemoCard
                                key={memo.id}
                                memo={memo}
                                isEditing={editingId === memo.id}
                                editTitle={editTitle}
                                editContent={editContent}
                                onEditTitleChange={setEditTitle}
                                onEditContentChange={setEditContent}
                                onSave={handleSaveEdit}
                                onCancel={() => setEditingId(null)}
                                onEditStart={handleEdit}
                                onDelete={handleDelete}
                                onTogglePin={handleTogglePin}
                                onToggleCheckbox={handleToggleCheckbox}
                                onContentUpdate={handleInlineContentUpdate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && filteredMemos.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <StickyNote className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">
                        {searchQuery ? 'メモが見つかりません' : 'メモがありません'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {searchQuery ? '別のキーワードで検索してみてください' : '新しいメモを作成しましょう'}
                    </p>
                </div>
            )}
        </div>
    );
}
