import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CarFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  seatsFilter: string;
  setSeatsFilter: (seats: string) => void;
  colorFilter: string;
  setColorFilter: (color: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  onClearFilters: () => void;
}

export function CarFilters({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  typeFilter,
  setTypeFilter,
  seatsFilter,
  setSeatsFilter,
  colorFilter,
  setColorFilter,
  priceRange,
  setPriceRange,
  onClearFilters
}: CarFiltersProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/30 rounded-[1.25rem] shadow-elegant">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Filter Cars</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/30"
            />
          </div>

          {/* Brand Filter */}
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="bg-background/50 border-border/30">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="BMW">BMW</SelectItem>
              <SelectItem value="Mercedes">Mercedes</SelectItem>
              <SelectItem value="Audi">Audi</SelectItem>
              <SelectItem value="Lexus">Lexus</SelectItem>
              <SelectItem value="Porsche">Porsche</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-background/50 border-border/30">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Convertible">Convertible</SelectItem>
              <SelectItem value="Coupe">Coupe</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>

          {/* Seats Filter */}
          <Select value={seatsFilter} onValueChange={setSeatsFilter}>
            <SelectTrigger className="bg-background/50 border-border/30">
              <SelectValue placeholder="Seats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Seats</SelectItem>
              <SelectItem value="2">2 Seats</SelectItem>
              <SelectItem value="4">4 Seats</SelectItem>
              <SelectItem value="5">5 Seats</SelectItem>
              <SelectItem value="7">7 Seats</SelectItem>
              <SelectItem value="8">8+ Seats</SelectItem>
            </SelectContent>
          </Select>

          {/* Color Filter */}
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="bg-background/50 border-border/30">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="Black">Black</SelectItem>
              <SelectItem value="White">White</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Blue">Blue</SelectItem>
              <SelectItem value="Red">Red</SelectItem>
              <SelectItem value="Gray">Gray</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="bg-background/50 border-border/30">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-50">€0 - €50</SelectItem>
              <SelectItem value="50-100">€50 - €100</SelectItem>
              <SelectItem value="100-150">€100 - €150</SelectItem>
              <SelectItem value="150-200">€150 - €200</SelectItem>
              <SelectItem value="200+">€200+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="bg-background/50 border-border/30 hover:bg-background/80"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}