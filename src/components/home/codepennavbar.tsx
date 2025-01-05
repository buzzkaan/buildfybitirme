<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center">
    <div className="mr-4 hidden md:flex">
      <a className="mr-6 flex items-center space-x-2" href="#">
        <Code className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">CodePen</span>
      </a>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          href="#"
        >
          Explore
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          href="#"
        >
          Challenges
        </a>
        <a
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          href="#"
        >
          Spark
        </a>
      </nav>
    </div>
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <Input
          className="w-full md:w-[300px] pl-8"
          placeholder="Search..."
          type="search"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      <nav className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  </div>
</header>;
