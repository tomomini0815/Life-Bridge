import { useState, useEffect } from 'react';
import { Memo, CheckboxItem } from '@/types/memo';
import { memoService } from '@/services/MemoService';
import { cn } from '@/lib/utils';
import {
    Plus,
    Search,
    Pin,
    Trash2,
    MoreVertical,
    Check,
    X,
    StickyNote,
    Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MEMO_COLORS = [
    { name: 'default', bg: 'bg-white dark:bg-zinc-900', border: 'border-gray-200 dark:border-zinc-700' },
    { name: 'red', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900' },
    { name: 'orange', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900' },
    { name: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-900' },
    { name: 'green', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900' },
    { name: 'blue', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900' },
    { name: 'purple', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900' },
];

export function MemoManager() {
    const [memos, setMemos] = useState<Memo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        loadMemos();
    }, []);

    const loadMemos = () => {
        const allMemos = memoService.getAllMemos();
        setMemos(allMemos);
    };

    const filteredMemos = searchQuery
        ? memoService.searchMemos(searchQuery)
        : memos;

    const pinnedMemos = filteredMemos.filter(m => m.isPinned);
    const unpinnedMemos = filteredMemos.filter(m => !m.isPinned);

    const handleCreate = () => {
        if (!newTitle.trim() && !newContent.trim()) return;

        memoService.createMemo(
            newTitle.trim() || '無題のメモ',
            newContent
        );
        setNewTitle('');
        setNewContent('');
        setIsCreating(false);
        loadMemos();
    };

    const handleEdit = (memo: Memo) => {
        setEditingId(memo.id);
        setEditTitle(memo.title);
        setEditContent(memo.content);
    };

    const handleSaveEdit = () => {
        if (!editingId) return;

        memoService.updateMemo(editingId, {
            title: editTitle.trim() || '無題のメモ',
            content: editContent,
        });
        setEditingId(null);
        loadMemos();
    };

    const handleDelete = (id: string) => {
        memoService.deleteMemo(id);
        loadMemos();
    };

    const handleTogglePin = (id: string) => {
        memoService.togglePin(id);
        loadMemos();
    };

    const handleToggleCheckbox = (memoId: string, itemId: string) => {
        memoService.toggleCheckboxItem(memoId, itemId);
        loadMemos();
    };

    const MemoCard = ({ memo }: { memo: Memo }) => {
        const isEditing = editingId === memo.id;
        const colorScheme = MEMO_COLORS[0]; // Default color for now

        return (
            <div
                className={cn(
                    "group rounded-xl border transition-all duration-200 hover:shadow-md",
                    colorScheme.bg,
                    colorScheme.border
                )}
            >
                {isEditing ? (
                    // Edit Mode
                    <div className="p-4 space-y-3">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="タイトル"
                            className="w-full px-0 py-1 bg-transparent border-0 text-base font-medium focus:outline-none placeholder:text-muted-foreground"
                            autoFocus
                        />
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="メモを入力..."
                            rows={4}
                            className="w-full px-0 py-1 bg-transparent border-0 text-sm focus:outline-none resize-none placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2 justify-end pt-2">
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                キャンセル
                            </Button>
                            <Button size="sm" onClick={handleSaveEdit}>
                                完了
                            </Button>
                        </div>
                    </div>
                ) : (
                    // View Mode
                    <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-medium text-base flex-1 break-words">
                                {memo.title}
                            </h3>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleTogglePin(memo.id)}
                                    className={cn(
                                        "p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                                        memo.isPinned && "opacity-100"
                                    )}
                                    title={memo.isPinned ? "ピン解除" : "ピン留め"}
                                >
                                    <Pin className={cn("w-4 h-4", memo.isPinned && "fill-current")} />
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(memo)}>
                                            編集
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(memo.id)}
                                            className="text-red-600"
                                        >
                                            削除
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {memo.checkboxItems && memo.checkboxItems.length > 0 ? (
                            <div className="space-y-1.5">
                                {memo.checkboxItems.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex items-start gap-2 cursor-pointer group/item"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => handleToggleCheckbox(memo.id, item.id)}
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span
                                            className={cn(
                                                "text-sm flex-1 break-words",
                                                item.checked && "line-through text-muted-foreground"
                                            )}
                                        >
                                            {item.text}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words line-clamp-10">
                                {memo.content}
                            </p>
                        )}

                        {memo.tags && memo.tags.length > 0 && (
                            <div className="flex gap-1 mt-3 flex-wrap">
                                {memo.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-foreground/60"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                        <StickyNote className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-medium text-foreground">メモ</h1>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl">
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

            {/* Pinned Memos */}
            {pinnedMemos.length > 0 && (
                <div>
                    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                        ピン留め済み
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pinnedMemos.map((memo) => (
                            <MemoCard key={memo.id} memo={memo} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Memos */}
            {unpinnedMemos.length > 0 && (
                <div>
                    {pinnedMemos.length > 0 && (
                        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            その他
                        </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {unpinnedMemos.map((memo) => (
                            <MemoCard key={memo.id} memo={memo} />
                        ))}
                    </div>
                </div>
            )}

            {filteredMemos.length === 0 && (
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
